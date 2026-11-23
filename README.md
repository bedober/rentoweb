# Rento — Rent Made Simple

Next.js 14 App Router, TypeScript, Tailwind CSS and Firebase rental-management application with server-only Pesapal v3 checkout.

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Use Node.js 20+. Configure Firebase Web values from Project settings and Admin SDK service-account values on the server only. Never prefix secrets with NEXT_PUBLIC. Generate CONFIG_ENCRYPTION_KEY with `openssl rand -hex 32`; it encrypts credentials entered in the admin settings before they are stored in the server-only app_config_private collection. Keep this key backed up and never expose it to the browser.

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

## API routes currently implemented

All protected routes require a Firebase ID token in the `Authorization: Bearer <token>` header. Financial mutations are performed with Firebase Admin SDK transactions; browser clients cannot directly write wallet balances or wallet transaction records.

| Route | Methods | Purpose |
|---|---|---|
| `/api/profile` | POST | Create a profile once; an existing account's role is not overwritten |
| `/api/properties` | GET, POST | List visible properties and create landlord listings |
| `/api/properties/[id]` | PATCH, DELETE | Edit, publish, draft, or archive an owned listing |
| `/api/invoices` | GET, POST | List invoices by role and issue a rent invoice to a tenant |
| `/api/maintenance` | GET, POST | Create maintenance requests and view requests by requester/landlord |
| `/api/admin/users` | GET, PATCH | Super-admin user listing, role changes and account blocking |
| `/api/wallet/pay-rent` | POST | Atomically debit tenant and credit landlord wallets for a payable invoice |
| `/api/pesapal/create-order` | POST | Create a Pesapal checkout order server-side |
| `/api/pesapal/ipn` | GET, POST | Verify Pesapal transaction status and credit a wallet once |
| `/api/admin/update-config` | POST | Save public settings and encrypt provider secrets |
| `/api/admin/test-pesapal` | POST | Test server-side Pesapal credentials |

GitHub Actions CI is configured in `.github/workflows/ci.yml` to install dependencies, run TypeScript checks, and attempt a production build on pushes and pull requests to `main`.

**Release status:** this repository is an active implementation, not yet certified for production. The CI workflow has been added but has not yet been observed passing. Before handling real rent or deposits, implement and independently test payment reconciliation, refunds, withdrawal controls, fraud/abuse limits, audit review, tenant/lease lifecycle, and end-to-end authorization tests. Never put provider secrets in `NEXT_PUBLIC_*` variables.
