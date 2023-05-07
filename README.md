# AppleFritter

I originally set out to create a Twitter clone. I wanted it to look, and feel different from Twitter, while retaining the core functionality of Twtiter. While AppleFritter is still a WIP, I am proud of the progress I have made so far, and am excited to continue working on it.

> I have taken the live site down and included images of the site below.

## How It's Made:

**Tech used:** TypeScript, Next.js, React, PostgreSQL, Tailwind, Prisma, tRPC, NextAuth

The original version of AppleFritter had a separate backend using Express, with MongoDB, and TypeScript. However, the database very quickly became too much of a hassle to even ATTEMPT to maintain. I completely scrapped the original version, and realized that a relational database would be MUCH better to work with and maintain.

I opted to rebuild AppleFritter with [create-t3-app](https://github.com/t3-oss/create-t3-app)

## Lessons Learned:

I have learned SO much during the making of this project. I had no prior knowledge with any of the following: Next.js, NextAuth, PostgreSQL, Prisma, and tRPC. I have learned so much about the importance of database design. After working with PostgreSQL, I realize how amazing it is to work with relational databases. Prior to this project, I've only used non-relational databases.

## Pictures

"All Posts" Feed

!["All Posts" Feed](https://github.com/ky-ler/applefritter/raw/main/media/main.png)

Login Page

![Login Page](https://github.com/ky-ler/applefritter/raw/main/media/login_page.png)

Profile Page

![Profile Page](https://github.com/ky-ler/applefritter/raw/main/media/profile_page.png)

Example of a post thread (similar to one on Twitter)

![Post Thread](https://github.com/ky-ler/applefritter/raw/main/media/thread_example.png)

Signup Process

![Signup Process](https://github.com/ky-ler/applefritter/raw/main/media/signup_process.png)

"My Feed" page gives user an error when either 1: they don't follow anyone or 2: the users they follow have not posted anything

!["My Feed" page when a user doesn't follow anyone gives an error](https://github.com/ky-ler/applefritter/raw/main/media/feed_without_following_anyone.png)
