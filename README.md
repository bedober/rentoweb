# Rento — Rent Made Simple

Next.js 14 App Router, TypeScript, Tailwind CSS and Firebase rental-management application with server-only Pesapal v3 checkout.

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Use Node.js 20+. Configure Firebase Web values from Project settings and Admin SDK service-account values on the server only. Never prefix secrets with NEXT_PUBLIC.

## Firebase setup
Create a Firebase project, register a Web app, enable Email/Password, Google, Facebook and Phone providers as needed, create Firestore and Storage, then deploy rules with `firebase deploy --only firestore:rules,storage`. Create a service account and set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (newlines escaped as \\n).

## Pesapal sandbox
Create a Pesapal developer account and sandbox app to obtain Consumer Key and Consumer Secret. Register `https://YOUR_DOMAIN/api/pesapal/ipn` in the merchant portal and set the resulting IPN ID. Configure PESAPAL_ENV=sandbox, PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET and PESAPAL_IPN_ID. Checkout creation and status verification are server-side. Use Pesapal sandbox test instruments; 256700000000 is the requested test MSISDN, subject to sandbox account test rules.

## Africa's Talking
Create an Africa's Talking app, choose Sandbox or Production, and set AT_ENV, AT_API_KEY, AT_USERNAME and AT_SENDER_ID. SMS delivery is not active until a verified server-side SMS integration and sender ID are configured.

## Super admin
Create the first user in Firebase Authentication, then securely set users/{uid}.role to SUPER_ADMIN using Firebase Admin SDK or Firebase Console. Never expose SUPER_ADMIN in public signup.

## Vercel
Import the repo, select Next.js, add .env.example values in Project Settings, set NEXT_PUBLIC_APP_URL to the production URL, add the Vercel domain to Firebase Auth authorized domains and register the production Pesapal IPN URL.

## Implementation status
Included: Firebase email/password and Google/Facebook sign-in UI, profile creation, server-verified admin config updates, Pesapal hosted checkout creation and IPN status verification, authenticated wallet balance/history endpoints, Firestore and Storage rules. Phone OTP + email challenge, hashed wallet PIN, KYC, payouts, FCM/SMS delivery, monthly invoice scheduler, PDF receipts, full property/lease CRUD and complete admin tables are not yet implemented. Do not use for live money movement until those controls and reconciliation are implemented and independently audited. Dashboard sample figures are illustrative, not seeded financial records.
