# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-06-02

This release brings a complete premium UI/UX overhaul to the Tamil Dua application, aligning it with Apple's Human Interface Guidelines (HIG), introducing dynamic theme customization, and improving app responsiveness.

### Added
- **Dynamic Premium Theme Accent System**: Added 6 premium color themes in the Settings page:
  - Champagne Gold (Default)
  - Royal Emerald
  - Deep Crimson
  - Sapphire Blue
  - Rose Gold
  - Amethyst Purple
- **Always-Dark Console Sidebar**: The navigation drawer now consistently maintains a dark, premium aesthetic that adapts dynamically to the active color accent, regardless of the app's global light or dark mode state.
- **Dynamic Time-of-Day Greeting Hero Banner**: Home page features a gradient-filled hero banner with automatic greeting adjustments ("காலை வணக்கம்", "மதிய வணக்கம்", "மாலை வணக்கம்", "இரவு வணக்கம்") based on the device's local time.
- **Glassmorphic UI Elements**: Implemented glassmorphism (translucent backdrop filters, thin border trims, and subtle shadows) across app headers, toolbars, search widgets, cards, and modal components.
- **Spotlight Search Widget**: Integrated real-time supplication search on the Home page with quick clear actions.

### Changed
- **Refactored Settings Screen**: Overhauled Settings layout with custom font size controls, Arabic typeface picker cards, visual visibility toggles for translations/Hadees, and a backup/restore vault.
- **Redesigned Supplications (Dua List) & Favorites Pages**: Restructured categories with premium list rows, circular badges, and clean metadata representation.
- **iOS-style Navigation Transition Animations**: Enforced native-like transition animations globally to guarantee smooth page navigation.
- **Header Structure Refactor**: Transitioned headers and centered titles to native Ionic slots to completely eliminate navigation render lags.

### Fixed
- **Background Bleeding on Rounded Corners**: Fixed a rendering artifact on gradient-filled hero cards by applying `background-clip: padding-box` to ensure smooth anti-aliased corners.
- **Text Contrast in Settings Option Cards**: Resolved a contrast bug by defining global primary and secondary text variables (`--home-text-main`, `--home-text-muted`) inside light/dark mode selectors.
- **Host Specificity Override Issues**: Appended specificity selectors in `global.scss` to allow theme accent overrides to properly style Ionic shadow DOM elements.
