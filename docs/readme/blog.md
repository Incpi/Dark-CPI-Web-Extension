---
title: 'Getting Started with Dark CPI Extension'
date: 'Jun 25, 2024'
excerpt: 'Web Extension for SAP CPI'
cover_image: '/images/posts/gitbash.jpg'
---

- [Our Vision of this Project](#our-vision-of-this-project)
- [Privacy and Data Protection](#privacy-and-data-protection)
- [Blog Post](#blog-post)
- [Installation](#installation)
- [Usage](#usage)
- [Theme Customization](#theme-customization)
  - [Using the URL Parameter for only SAP CPI (not for SAP BUILD) (Update: Temporary Debug Purpose, Replaced with UI)](#using-the-url-parameter-for-only-sap-cpi-not-for-sap-build-update-temporary-debug-purpose-replaced-with-ui)
  - [Available Themes](#available-themes)
  - [Custom Themes](#custom-themes)
- [Changelogs](#changelogs)
  - [v1.3.4](#v134)
  - [v1.3.3](#v133)
  - [v1.2.0](#v120)
  - [v1.1.0](#v110)
  - [v1.0.0](#v100)
- [Code of Conduct](#code-of-conduct)
- [Contributing](#contributing)
- [Code Review Guidelines](#code-review-guidelines)
- [Support](#support)

Welcome to the Dark CPI Web Extension for SAP CPI and Build-workzone repository! This open-source project provides a sleek, dark interface for your SAP environment, enhancing visual comfort and overall user experience.

## Our Vision of this Project

It addresses the common need for a cohesive and comfortable visual interface by extending the dark theme across various UI elements. Moreover, the ability to personalize and extend SAP applications allows for a more tailored user experience, aligning with individual preferences and working conditions.

## Privacy and Data Protection

The plugin does not collect personal data. However, stores like the Chrome Web Store collect some anonymous data, such as how many users have the plugin installed. We do not trust third-party libraries & tools, so we implemented our own solution instead of relying on libraries to ensure security for logging in the browser. Nothing is stored or sent to any server by this plugin.

We guarantee:
- No personal data or tenant information is collected.
- It is open source, so feel free to check the source code or your network console.

## Blog Post

[SAP Blog Post in Community](https://community.sap.com/t5/technology-blogs-by-members/introducing-dark-cpi-web-extension-for-sap-applications/ba-p/13728785)

## Installation

> [!WARNING]  
> No Firefox browser support.

To install the Dark CPI Extension, please follow these steps:

1. **Download the Extension:**
   - Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/dark-sap-cpi/lmegddleeigeddljmdkonofmppbefneo) or [Edge Store](https://microsoftedge.microsoft.com/addons/detail/gpafgeambljleonppfbeieehlmdiffop) or search for "Dark CPI" in web stores.
   - Click "Add to Chrome" to install the extension.

2. **Manual Installation:**
   - Download the latest release from our [GitHub repository](https://github.com/incpi/Dark-CPI-Web-Extension), then go to the bin folder.
   - Extract the downloaded archive.
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top-right corner.
   - Click "Load unpacked" and select the extracted folder.

## Usage

Using the Dark CPI Extension is straightforward:

1. Open your SAP CPI environment.
2. The extension will automatically apply the dark theme to your interface, or select it from the extension icon on top in the browser beside the URL if pinned.

Additionally, we support SAP BUILD and Theme Designer.

## Theme Customization

The Dark CPI Extension allows you to customize the theme by specifying a URL parameter. This feature enables you to choose from a variety of predefined themes.

### Using the URL Parameter for only SAP CPI (not for SAP BUILD) (Update: Temporary Debug Purpose, Replaced with UI)

To select a specific theme, append the `darkcpi` parameter to the URL of your SAP CPI environment, followed by the desired theme value. For example, from the design page:
`https://your-sap-cpi-environment.ondamand.com/shell/design?darkcpi=theme-value`

Replace `theme-value` with one of the valid keys from the `themeMap` object.

### Available Themes

The extension comes with the following predefined themes:
- `0`: Morning Horizon - New Theme By SAP
- `1`: Evening Horizon - Dark Theme similar to New UI
- `2`: Quartz Light - Previous UI Theme before Morning Horizon
  
> [!NOTE] Any other theme by SAP is not compatible with this extension.

### Custom Themes

If you want to create your own custom theme, you can modify the `themeMap` object in the source code. Add a new key-value pair, where the key represents the theme name (to be used in the URL parameter), and the value is an object containing the CSS styles for your custom theme.

## Changelogs

### v1.3.4
- **Feature**: Added support for additional **SAP CPI - fka HCI / old Tenants**
- **Bugfix**: UI changes fixes.

### v1.3.3
- **Bugfix**: SAP UI theme Horizon dark fix (Trace half screen not visible).
- **Bugfix**: Mapping fields are invisible in mmap files.
- **Bugfix**: Simulation error color is not correct.
- **Feature**: Now supports additional applications such as **SAP Builds Workzone** and its theme designer.
- **Feature**: Dark theme supports CPI capabilities like Integration Assessment & Migration Assessment.
- **Improvement**: UI changes for the popup.

### v1.2.0
- **Feature**: Automatically closes the navigation bar on startup.
- **Feature**: Added in **Edge Store**.
- **Bugfix**: SAP UI theme Horizon fix.
- **Improvement**: UI improvement: select theme from the extension icon.

### v1.1.0
- **Bugfix**: Added support for mapping pages.
- **Feature**: Change theme from the popup page.

### v1.0.0
- Dark theme for SAP CPI. Initial public version.

## Code of Conduct

We are committed to fostering an open and welcoming environment for all contributors and users. Please adhere to our [Code of Conduct](#), which outlines the expected behavior and guidelines for participation in this project.

## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1. **Fork the Repository:** Click the "Fork" button at the top of our GitHub page.
2. **Clone Your Fork:** Use `git clone <your-fork-url>` to clone your fork to your local machine.
3. **Create a Branch:** Use `git checkout -b feature-branch` to create a new branch for your feature or bugfix.
4. **Make Changes:** Implement your changes.
5. **Commit and Push:** Use `git commit -m "Description of changes"` and `git push origin feature-branch`.
6. **Create a Pull Request:** Submit a pull request to our repository.

> [!IMPORTANT]  
> No 3rd party libraries are allowed in minified versions. If you want to include them, they should be in an uncompressed version so that we can review and set other environments as `ISOLATED` for security reasons.

Please refer to our [Contribution Guidelines]() for more detailed information.

## Code Review Guidelines

To ensure the highest quality of code and maintain the project's integrity, we have established strict guidelines for code reviews:
- **Security:** Verify that your code does not introduce security vulnerabilities.

We appreciate your patience and cooperation during the review process.

## Support

If you have any questions, issues, or suggestions, please feel free to [open an issue](https://github.com/incpi/Dark-CPI-Web-Extension/issues) on GitHub.

Thank you for using the Dark CPI Extension! We hope it enhances your SAP experience.
