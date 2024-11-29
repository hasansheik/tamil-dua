# Tamil Dua

This is an Ionic Framework application that provides a collection of Tamil dua (prayers). The app is designed to help users access and recite Tamil prayers conveniently on their mobile devices.

## Features

- [x] Tamil Dua Collection: The app includes a comprehensive collection of Tamil dua (prayers) categorized by various topics.
- [] Search: Users can search for specific dua by entering keywords.
- [] Favorites: Users can mark dua as favorites for quick access.
- [x] Share: Users can share dua with others via email, SMS, and other social media platforms.
- [x] Text Size: Users can adjust the text size of the dua.
- [] Text-to-Speech: Users can listen to the dua using the text-to-speech feature.
- [x] Dark Mode: Users can switch between light and dark mode.
- [x] Offline: The app works offline and does not require an internet connection.
- [x] No Ads: The app is 100% free and does not contain any ads.
- [x] No Tracking: The app does not track users or collect any data.
- [x] Open Source: The app is open source and the source code is available on GitHub.

## Screenshots
[To be added]

## Download

Play Store: [Download from Play Store](https://play.google.com/store/apps/details?id=com.hasan.app.tamildua)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Ionic Framework](https://ionicframework.com/)

## Contact

If you have any questions or comments, please send an email to [Hasan's Experiment](mailto:hasansexperiment@gmail.com).

## Website

Visit the [Tamil Dua Website](http://tamildua.appspot.com/tamildua.html?_sm_au_=i2V60JQjV6Snt1vP) for more information and resources.

## Privacy Policy

Please refer to our [Privacy Policy](https://www.freeprivacypolicy.com/live/b29ab5e0-7e89-47e0-af55-24b93ad327f0) to understand how we handle your personal information.

## Building for Android

### Prerequisites
1. Install Android Studio from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Install Java Development Kit (JDK) version 11 or higher
3. Set up environment variables:
   - JAVA_HOME: Path to your JDK installation
   - ANDROID_HOME: Path to your Android SDK installation
   - Add platform-tools to PATH: %ANDROID_HOME%\platform-tools

### Build Steps

1. Install required dependencies:
```bash
npm install --legacy-peer-deps
```
2. Install Capacitor:
```bash
npm install @capacitor/android
npm install @capacitor/core
```
3. Build the web assets:
```bash
ionic build --prod
```
4. Add Android platform:
```bash
ionic cap add android
```
5. Copy web assets to Android project:
```bash
ionic cap copy
```
6. Update Android native project:
```bash
ionic cap sync
```
7. Open in Android Studio:
```bash
ionic cap open android
```
8. In Android Studio:
   - Wait for Gradle sync to complete
   - Update `android/app/build.gradle` with your app details:
     ```gradle
     defaultConfig {
         applicationId "com.tamildua.app"
         minSdkVersion rootProject.ext.minSdkVersion
         targetSdkVersion rootProject.ext.targetSdkVersion
         versionCode 1
         versionName "1.0"
     }
     ```

9. Build APK:
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Or use Build > Generate Signed Bundle / APK for release version

### Testing
- Connect Android device via USB with USB debugging enabled
- Click "Run" in Android Studio to test on your device
- Or find the APK in `android/app/build/outputs/apk/debug/`

### Release Build
1. Generate signing key:
```bash
keytool -genkey -v -keystore tamil-dua.keystore -alias tamil-dua -keyalg RSA -keysize 2048 -validity 10000
```
2. Configure signing in Android Studio:
   - Build > Generate Signed Bundle / APK
   - Choose APK
   - Create or select keystore
   - Choose release build variant
   - Find signed APK in `android/app/build/outputs/apk/release/`

### Troubleshooting
- If you encounter Gradle sync issues:
  - File > Invalidate Caches / Restart
  - Update Gradle version in `android/build.gradle`
- For build errors:
  - Clean project: Build > Clean Project
  - Rebuild project: Build > Rebuild Project

### Updating the App
When making changes to the web code:
1. Make your changes
2. Run `ionic build --prod`
3. Run `ionic cap copy`
4. Run `ionic cap sync`
5. Rebuild in Android Studio

### Keystore kadavu chol
hasankeystore
oldgmailpw