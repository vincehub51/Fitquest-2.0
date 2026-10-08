# FitQuest (React Native)

FitQuest is a React Native app built with Expo. The original Flutter project is in the sibling
`fitquest` folder; this app ports its splash, sign-in, home, weekly plan, workout session, history,
and profile screens.

## Run the app

From this folder, install dependencies and start Expo:

```bash
npm install
npm start
```

Use the Expo terminal shortcuts to open the app in an Android emulator, iOS simulator, or web
browser. On Windows, an Android emulator requires Android Studio; iOS simulator builds require
macOS.

## Current sign-in behavior

Sign-in follows the original Flutter app: it validates the email/password fields and then enters
the app after a short delay. The Flutter source marks Firebase authentication and session saving as
TODOs, and does not include Firebase project configuration, so those backend operations are not
configured in this React Native port either.
