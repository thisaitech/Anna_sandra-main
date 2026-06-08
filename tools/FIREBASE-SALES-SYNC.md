# Fix: Missing or insufficient permissions (sales / parties sync)

## What the console means

`FirebaseError: Missing or insufficient permissions` means **Firestore security rules blocked** the write/read.  
Local data (parties/sales) can still show from IndexedDB, but **cloud sync fails**.

Rules require (`firestore.rules`):

1. Signed in with **Firebase Auth** (real email login, not only `offline-local`)
2. Document exists: `users/{your-uid}` with:
   - `status`: `"active"`
   - `role`: one of `super_admin`, `org_admin`, `admin`, `manager`, `sales`, `staff`, `cashier`
   - `companyId`: e.g. `petshop-main`
3. Every invoice/party/item must use the **same** `companyId` on the document

## One-time server setup

```bash
# Deploy rules (from project root)
firebase deploy --only firestore:rules

# Create admin user + users/{uid} doc (needs Firebase CLI login or service account)
node tools/create-admin-user.cjs
```

Then log in at `/login` with:

- Email: `admin@petshop.local`
- Password: `Petshop@2024`
- Company id in Firestore: `petshop-main`

## After app update (v43+)

- Sales list keeps **all local + IndexedDB** invoices even when cloud returns permission errors
- Sync retries instead of dropping pending rows on permission errors
- Clearer sync banner message

Hard refresh: `?pwa-reset=1&fresh=1`
