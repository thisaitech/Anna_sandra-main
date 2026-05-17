# GitHub Actions Deployment (Client)

## Required repository secrets
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Production pipeline
Main branch deploy should run:
1. `npm ci`
2. `npm ci --prefix functions`
3. `npm run build`
4. `npm --prefix functions run build`
5. `firebase deploy --only firestore:rules,firestore:indexes,functions,hosting --project $FIREBASE_PROJECT_ID`

## Preview pipeline
Pull requests should:
1. Build web and functions.
2. Deploy hosting preview channel `pr-<number>`.

## Post-deploy checks
1. Open app URL and confirm login works.
2. Open Sales/Purchases/Parties routes.
3. Confirm one export action and one payment flow.
4. Check Functions logs for secret/config errors.
