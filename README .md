# বাজারদর (Bazar-Dor)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান ও আগের বাজারদর দেখা এবং বিভিন্ন
বাজারের দামের তুলনা করার জন্য তৈরি একটি ওয়েব অ্যাপ্লিকেশন।

**Live Demo:** https://assignment-7-taupe-nine.vercel.app\
**Repository:** https://github.com/buildbyanas/Assignment-7

## Features

-   বাংলা ভাষায় পণ্যের বাজারদর দেখা
-   ক্যাটাগরি অনুযায়ী পণ্য ব্রাউজ করা
-   পণ্যের দাম কম থেকে বেশি অথবা বেশি থেকে কম সাজানো
-   পণ্যের বিস্তারিত তথ্য দেখা
-   আজ, গতকাল, গত সপ্তাহ ও গত মাসের দামের তুলনা
-   বাজারভিত্তিক সর্বনিম্ন, সর্বোচ্চ ও গড় দামের হিসাব
-   ইমেইল ও পাসওয়ার্ড দিয়ে Sign Up এবং Sign In
-   Google ও GitHub দিয়ে OAuth Sign In
-   লগইন করা ব্যবহারকারীর জন্য প্রোফাইল দেখা ও নাম আপডেট করা
-   Sign Out
-   Protected Product Details Page
-   Success, error ও loading Toast notifications
-   Responsive layout

## Tech Stack

-   [Next.js](https://nextjs.org/) --- App Router
-   [React](https://react.dev/)
-   TypeScript
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Better Auth](https://www.better-auth.com/) --- Authentication
-   [MongoDB Atlas](https://www.mongodb.com/atlas) --- Authentication
    database
-   [React Hot Toast](https://react-hot-toast.com/) --- Toast
    notifications
-   [Programming Hero Bazar-Dor
    API](https://openapi.programming-hero.com/api/bazardor)
-   [Vercel](https://vercel.com/) --- Deployment

## Requirements

-   Node.js-এর উপযুক্ত LTS সংস্করণ
-   npm
-   MongoDB Atlas database
-   Google/GitHub OAuth credentials (সোশ্যাল লগইনের জন্য)

## Installation

### 1. Repository ক্লোন করুন

``` bash
git clone https://github.com/buildbyanas/Assignment-7.git
cd Assignment-7
```

### 2. Dependencies ইনস্টল করুন

``` bash
npm install
```

### 3. Environment variables সেট করুন

প্রজেক্টের root directory-তে `.env.local` ফাইল তৈরি করে নিচের variable-গুলো
যোগ করুন:

``` env
NEXT_PUBLIC_API_BASE_URL=https://openapi.programming-hero.com/api/bazardor

BETTER_AUTH_SECRET=replace_with_a_secure_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/bazar_dor?retryWrites=true&w=majority

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**গুরুত্বপূর্ণ:** - Placeholder-গুলো নিজের আসল credential দিয়ে প্রতিস্থাপন
করুন। - `.env.local` কখনো GitHub-এ commit করবেন না। -
`BETTER_AUTH_SECRET`-এর জন্য একটি শক্তিশালী, গোপন random secret ব্যবহার
করুন। - MongoDB Atlas-এ database user, network access এবং connection URI
ঠিকভাবে কনফিগার করুন। - শুধু ইমেইল/পাসওয়ার্ড authentication ব্যবহার করলে
OAuth credential প্রয়োজন হবে না; তবে Google/GitHub login চালু রাখতে
সংশ্লিষ্ট credential লাগবে।

### 4. OAuth callback URL কনফিগার করুন

**Local development**

Google OAuth redirect URI:

``` text
http://localhost:3000/api/auth/callback/google
```

GitHub OAuth callback URL:

``` text
http://localhost:3000/api/auth/callback/github
```

**Production**

Google OAuth redirect URI:

``` text
https://assignment-7-taupe-nine.vercel.app/api/auth/callback/google
```

GitHub OAuth callback URL:

``` text
https://assignment-7-taupe-nine.vercel.app/api/auth/callback/github
```

Google/GitHub provider dashboard-এ callback URL এবং অনুমোদিত origin
সঠিকভাবে সেট করতে হবে। Google OAuth app Testing mode-এ থাকলে অনুমোদিত
test user যোগ করতে হতে পারে।

### 5. Development server চালু করুন

``` bash
npm run dev
```

তারপর ব্রাউজারে খুলুন:

``` text
http://localhost:3000
```

## Available Scripts

  Command           কাজ
  ----------------- ----------------------------
  `npm run dev`     Development server চালু করে
  `npm run build`   Production build তৈরি করে
  `npm run start`   Production server চালু করে
  `npm run lint`    ESLint দিয়ে code lint করে

## API Endpoints

Base URL:

``` text
https://openapi.programming-hero.com/api/bazardor
```

  Endpoint              ব্যবহার
  --------------------- ------------------------
  `/products`           সব পণ্যের তথ্য
  `/products/:id`       নির্দিষ্ট পণ্যের বিস্তারিত
  `/categories`         সব ক্যাটাগরির তথ্য
  `/categories/:slug`   নির্দিষ্ট ক্যাটাগরির তথ্য

API থেকে পাওয়া তথ্যের ওপর ভিত্তি করে পণ্যের নাম, ক্যাটাগরি, মূল্য এবং
বাজারভিত্তিক তথ্য দেখানো হয়।

## Authentication

Better Auth ব্যবহার করে নিচের authentication সুবিধা যুক্ত করা হয়েছে:

-   Email ও password দিয়ে account তৈরি এবং Sign In
-   Google OAuth
-   GitHub OAuth
-   Profile page-এ নাম আপডেট
-   Sign Out
-   Product details page-এ server-side session check

Protected product page দেখতে লগইন প্রয়োজন। লগইন না থাকলে ব্যবহারকারীকে
Sign In পেজে পাঠানো হয়; Sign In-এর পর নির্দিষ্ট product page-এ ফেরত আসার
ব্যবস্থা রয়েছে।

## Deployment on Vercel

1.  GitHub repository Vercel-এ import করুন।
2.  Vercel project settings-এর **Environment Variables**-এ প্রয়োজনীয়
    variable-গুলো যোগ করুন।
3.  Production-এর জন্য `BETTER_AUTH_URL` এবং
    `NEXT_PUBLIC_BETTER_AUTH_URL`-এ deployed site-এর URL দিন।
4.  Google ও GitHub OAuth dashboard-এ production callback URL যোগ করুন।
5.  নতুন environment variable যোগ বা পরিবর্তন করলে নতুন deployment করুন।

Production environment-এর URL উদাহরণ:

``` env
BETTER_AUTH_URL=https://assignment-7-taupe-nine.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://assignment-7-taupe-nine.vercel.app
```

## Project Structure

প্রজেক্টের গুরুত্বপূর্ণ অংশগুলো:

``` text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── category/
│   ├── product/
│   ├── profile/
│   ├── signin/
│   ├── signup/
│   ├── layout.tsx
│   └── page.tsx
├── assets/
├── components/
└── lib/
    ├── api.ts
    ├── auth.ts
    └── auth-client.ts
```

> ফোল্ডার বা ফাইলের নামের সামান্য পার্থক্য থাকলে আপনার repository-র বর্তমান
> structure-কে অনুসরণ করুন।

## Security Notes

-   Secret, database password বা OAuth client secret source code-এ
    লিখবেন না।
-   `.env.local` এবং অন্য secret-bearing file public repository-তে প্রকাশ
    করবেন না।
-   Production environment variables Vercel project settings থেকে
    পরিচালনা করুন।
-   OAuth provider-এর callback URL ও authorized origin অবশ্যই deployed
    domain-এর সঙ্গে মিলিয়ে দিন।

## License

এই repository-তে আলাদা license file না থাকলে ব্যবহারের শর্ত নির্ধারিত
হয়েছে---এমন ধরে নেওয়া উচিত নয়।
