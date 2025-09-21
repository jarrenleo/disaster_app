# Clerk Auth Template

This is a [React Native](https://reactnative.dev) project built with [Expo](https://expo.dev), [Clerk](https://go.clerk.com/gjgxNgT), and [React Native Reusables](https://reactnativereusables.com).

It was initialized using the following command:

```bash
npx react-native-reusables/cli@latest init -t disaster_app
```

## Getting Started

Before running the app, make sure to:

1. [Set up your Clerk account](https://go.clerk.com/blVsQlm)
2. In the instance setup, leave the default option selected: **Email, phone, username**
3. Enable Apple, GitHub, and Google as sign-in options under SSO Connections
4. Rename `.env.example` to `.env.local` and paste your `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from [your API keys](https://go.clerk.com/u8KAui7)

Then start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This will launch the Expo Go Server. You can open the app with:

- **iOS**: press `i` to launch in the iOS simulator (Mac only)
- **Android**: press `a` to launch in the Android emulator
- **Web**: press `w` to run in a browser

Or scan the QR code with the [Expo Go](https://expo.dev/go) app to test on your device.

## Included Screens and Features

- Protected routes using Clerk authentication
- Sign in screen
- OAuth with Apple, GitHub, and Google
- Forgot password screen
- Reset password screen
- Verify email screen
- User profile button
- Sign out screen

## Project Features

- ⚛️ Built with [Expo Router](https://expo.dev/router)
- 🔐 Authentication powered by [Clerk](https://go.clerk.com/Q1MKAz0)
- 🎨 Styled with [Tailwind CSS](https://tailwindcss.com/) via [Nativewind](https://www.nativewind.dev/)
- 📦 UI powered by [React Native Reusables](https://github.com/founded-labs/react-native-reusables)
- 🚀 New Architecture enabled
- 🔥 Edge to Edge enabled
- 📱 Runs on iOS, Android, and Web

## Learn More

- [Clerk Docs](https://go.clerk.com/Q1MKAz0)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)

---

If this template helps you move faster, consider giving [React Native Reusables](https://github.com/founded-labs/react-native-reusables) a ⭐ on GitHub. It helps a lot!

## Supabase Setup

This app is now configured to use Supabase. To finish setup:

1. Create a Supabase project at `https://database.new` and copy:
   - Project URL
   - Anonymous (public) API key
2. Copy `env.example` to `.env` or `.env.local` and set:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Restart the dev server after changing env vars.

### Using the client

Import the client from `lib/supabase` anywhere in the app:

```
import { supabase } from '@/lib/supabase';

async function loadData() {
  const { data, error } = await supabase.from('your_table').select('*');
  if (error) throw error;
  return data;
}
```

Notes:

- Clerk remains the auth provider for UI/session. Supabase can be used for database, storage, and RPC.
- If you want to migrate auth to Supabase later (email magic links, OAuth, etc.), set a redirect URL matching your Expo scheme (`disaster_app://`) in the Supabase auth provider settings, then replace Clerk flows with Supabase Auth helpers.
