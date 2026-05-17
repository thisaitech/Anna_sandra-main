# Android Client Setup

## 1. Package identity
Default package in this delivery is `com.anna.erp`.

If client needs custom package:
- Update `android/app/build.gradle` (`namespace`, `applicationId`)
- Update `android/app/src/main/java/.../MainActivity.java` package line/path
- Update `capacitor.config.ts` `appId`

## 2. Firebase config
1. In Firebase Console, create Android app with matching package ID.
2. Download `google-services.json`.
3. Place it in `android/app/google-services.json`.

A placeholder file `android/app/google-services.example.json` is included.

## 3. Build

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## 4. Verify
- App launches
- Login works
- Sales and Purchases open
- Barcode/Camera permission prompts correctly
