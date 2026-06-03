/**
 * Create live login via Firebase Auth REST + Firestore REST (no service account).
 */
const API_KEY = 'AIzaSyDmnRrdEbC6Haf7Ts45AgCRKoZ6Ty3hI9U';
const PROJECT_ID = 'petshop-9dee5';
const EMAIL = 'admin@petshop.local';
const PASSWORD = 'Petshop@2024';
const DISPLAY_NAME = 'Pet Shop Admin';
const COMPANY_ID = 'petshop-main';
const COMPANY_NAME = 'Pet Shop';

async function authRequest(path, body) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${path}?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || res.statusText);
    err.code = data.error?.message;
    err.payload = data;
    throw err;
  }
  return data;
}

function firestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  throw new Error('Unsupported type: ' + typeof v);
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = firestoreValue(v);
  return fields;
}

async function main() {
  let auth;
  try {
    auth = await authRequest('accounts:signUp', {
      email: EMAIL,
      password: PASSWORD,
      returnSecureToken: true,
    });
    console.log('Created Firebase Auth user.');
  } catch (e) {
    if (!String(e.message || '').includes('EMAIL_EXISTS')) throw e;
    auth = await authRequest('accounts:signInWithPassword', {
      email: EMAIL,
      password: PASSWORD,
      returnSecureToken: true,
    });
    console.log('Auth user exists; signed in to update profile.');
  }

  const uid = auth.localId;
  const idToken = auth.idToken;
  const now = new Date().toISOString();

  const userDoc = {
    uid,
    email: EMAIL,
    displayName: DISPLAY_NAME,
    companyName: COMPANY_NAME,
    companyId: COMPANY_ID,
    role: 'org_admin',
    status: 'active',
    createdAt: now,
    lastLogin: now,
  };

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;

  const patchRes = await fetch(`${url}?updateMask.fieldPaths=uid&updateMask.fieldPaths=email&updateMask.fieldPaths=displayName&updateMask.fieldPaths=companyName&updateMask.fieldPaths=companyId&updateMask.fieldPaths=role&updateMask.fieldPaths=status&updateMask.fieldPaths=createdAt&updateMask.fieldPaths=lastLogin`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: toFirestoreFields(userDoc) }),
  });

  if (!patchRes.ok) {
    const createRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: toFirestoreFields(userDoc),
      }),
    });
    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error('Firestore write failed: ' + errText);
    }
    console.log('Created Firestore users document.');
  } else {
    console.log('Updated Firestore users document.');
  }

  console.log('\n--- Login credentials (live app) ---');
  console.log('URL:      https://petshop-9dee5.web.app/login');
  console.log('Email:    ' + EMAIL);
  console.log('Password: ' + PASSWORD);
  console.log('Role:     org_admin (full company admin access)');
}

main().catch((err) => {
  console.error('Failed:', err.message || err);
  if (err.payload) console.error(JSON.stringify(err.payload, null, 2));
  process.exit(1);
});
