const puppeteer = require('puppeteer');

const bravePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const userDataDir = 'C:\\Users\\toshi\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1';
const yourUsername = 'your username';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: bravePath,
    userDataDir,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto(`https://twitter.com/${yourUsername}`, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  console.log('💣 Starting full cleanup: retweets + all tweets...');

  let index = 1;
  let lastHeight = 0;
  let idleLoops = 0;

  while (true) {
    let didSomething = false;

    // 1. Unretweet if found
    const unretweetBtn = await page.$('[data-testid="unretweet"]');
    if (unretweetBtn) {
      try {
        await unretweetBtn.click();
        await page.waitForSelector('[data-testid="unretweetConfirm"]', { timeout: 3000 });
        await sleep(200);
        await page.click('[data-testid="unretweetConfirm"]');
        console.log(`🔁 Unretweeted #${index}`);
        index++;
        await sleep(700);
        didSomething = true;
        continue;
      } catch (err) {
        console.log(`⚠️ Unretweet failed: ${err.message}`);
      }
    }

    // 2. Delete tweets and quote tweets
    const tweets = await page.$$('[data-testid="tweet"]');

    for (const tweet of tweets) {
      const isPinned = await tweet.evaluate(el => el.innerText.includes("Pinned Tweet"));
      if (isPinned) continue;

      try {
        const caretBtn = await tweet.$('[data-testid="caret"]');
        if (!caretBtn) continue;

        await caretBtn.click();
        await sleep(500); // give time for dropdown

        // Try finding Delete in dropdown
        const deleted = await page.evaluate(() => {
          const menuItems = [...document.querySelectorAll('[role="menuitem"]')];
          const deleteBtn = menuItems.find(el => el.innerText.includes("Delete"));
          if (deleteBtn) {
            deleteBtn.click();
            return true;
          }
          return false;
        });

        if (deleted) {
          await page.waitForSelector('[data-testid="confirmationSheetConfirm"]', { timeout: 3000 });
          await page.click('[data-testid="confirmationSheetConfirm"]');
          console.log(`🗑️ Deleted tweet #${index}`);
          index++;
          await sleep(700);
          didSomething = true;
          break;
        } else {
          await page.keyboard.press('Escape');
        }
      } catch (err) {
        console.log(`⚠️ Delete failed: ${err.message}`);
      }
    }

    // 3. Scroll down if no action
    if (!didSomething) {
      const height = await page.evaluate(() => document.body.scrollHeight);
      if (height === lastHeight) {
        idleLoops++;
      } else {
        idleLoops = 0;
        lastHeight = height;
      }

      if (idleLoops >= 3) {
        console.log('✅ No more tweets or retweets to clean.');
        break;
      }

      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await sleep(1200);
    } else {
      idleLoops = 0;
    }
  }

  console.log('🎉 Done! Retweets & original tweets deleted.');
  await browser.close();
})();
