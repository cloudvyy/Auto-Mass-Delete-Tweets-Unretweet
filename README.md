Twitter/X Auto Tweet Cleaner (Retweets + Tweets)

This script helps you automatically delete your original tweets, quote tweets, and unretweet retweets directly from your profile timeline using Puppeteer + your Brave browser user session.

✅ Features

1. Unretweets retweets

2. Deletes original tweets

3. Deletes quote tweets

4. Skips pinned tweets

4. Fully automated scroll + click actions

5. Uses your logged-in Brave browser profile (no need for Twitter API or re-login)

🧩 Requirements

Node.js installed
Visual Studio
Brave Browser installed

Already logged in to X (Twitter) with your account in Brave (Profile 1)

 1. Install Puppeteer

Open your terminal and run:

npm init -y

npm install puppeteer


2. Configure Script

Edit auto-delete-all.js and set your actual X username (without the @) here:
const yourUsername = 'yourusername'; // change this

Make sure the paths to Brave and your profile are correct:

const bravePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const userDataDir = 'C:\\Users\\YOURNAME\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1';

3. Run the Script
node auto-delete-all.js


Optional how to run it open your terminal then write: 
git clone https://github.com/cloudvyy/twitter-auto-delete.git
cd twitter-auto-delete

Then install dependencies:
npm install


Notes!!!
It does not use Twitter API, so it's safe and based on browser automation

Do not interact with the mouse or keyboard while the script runs

May need to re-run if you have many thousands of tweets
