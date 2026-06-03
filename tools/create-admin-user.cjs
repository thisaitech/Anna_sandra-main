/**
 * Create Firebase Auth user + Firestore users/{uid} for live login.
 * Requires: firebase login (or GOOGLE_APPLICATION_CREDENTIALS service account).
 *
 * Usage: node create-admin-user.cjs
 */
const admin = require('firebase-admin');

const PROJECT_ID = 'petshop-9dee5';
const EMAIL = 'admin@petshop.local';
const PASSWORD = 'Petshop@2024';
const DISPLAY_NAME = 'Pet Shop Admin';
const COMPANY_ID = 'petshop-main';
const COMPANY_NAME = 'Pet Shop';

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: PROJECT_ID });
  }

  const auth = admin.auth();
  const db = admin.firestore();

  let user;
  try {
    user = await auth.getUserByEmail(EMAIL);
    console.log('Auth user already exists:', user.uid);
    await auth.updateUser(user.uid, { password: PASSWORD, displayName: DISPLAY_NAME });
    console.log('Password updated.');
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: DISPLAY_NAME,
      emailVerified: true,
    });
    console.log('Created auth user:', user.uid);
  }

  const now = new Date().toISOString();
  const userDoc = {
    uid: user.uid,
    email: EMAIL,
    displayName: DISPLAY_NAME,
    companyName: COMPANY_NAME,
    companyId: COMPANY_ID,
    role: 'super_admin',
    status: 'active',
    createdAt: now,
    lastLogin: now,
  };

  await db.collection('users').doc(user.uid).set(userDoc, { merge: true });
  console.log('Firestore users doc written.');

  console.log('\n--- Login credentials (live app) ---');
  console.log('URL:      https://petshop-9dee5.web.app/login');
  console.log('Email:    ' + EMAIL);
  console.log('Password: ' + PASSWORD);
  console.log('Company:  ' + COMPANY_ID);
  console.log('Role:     super_admin');
}

main().catch((err) => {
  console.error('Failed:', err.message || err);
  process.exit(1);
});
