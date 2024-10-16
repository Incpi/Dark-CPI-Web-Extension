<img src="\docs\Black_full.png" class="center" alt="icon"><h1>Web Extension for SAP Apps like CPI, Workzone </h1>

Welcome to the Dark CPI Web Extension for SAP CPI and Build-workzone repository! This open-source project provides a sleek, dark interface for your SAP environment, enhancing visual comfort and overall user experience.

## Our Vision of this Project

It addresses the common need for a cohesive and comfortable visual interface by extending the dark theme across various UI elements.Moreover, the ability to personalize and extend SAP applications allows for a more tailored user experience, aligning with individual preferences and working conditions.

## Privacy and data protection

The plugin does not collect personal data. Nevertheless the stores like Chrome Web Store collect some anonymous data like how many users have the plugin installed. We do not trust 3rd party library & tools so we implemented our own solution instead of library to ensure security for logging in browser but nothing is stored or sent to any server by this plugin.

We guarantee:

- No personal data / tenant information is collected.
- It is open source so feel free to check the source code or your network console.

## Blog post

[SAP Blog Post in community](https://community.sap.com/t5/technology-blogs-by-members/introducing-dark-cpi-web-extension-for-sap-applications/ba-p/13728785)

## Installation

> [!WARNING]  
> No Firefox browser support.

To install the Dark CPI Extension, please follow these steps:

1. **Download the Extension:**

   - Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/dark-sap-cpi/lmegddleeigeddljmdkonofmppbefneo) or [EDGE store](https://microsoftedge.microsoft.com/addons/detail/gpafgeambljleonppfbeieehlmdiffop) or search for "Dark CPI" in web-stores.
   - Click "Add to Chrome" to install the extension.

2. **Manual Installation:**
   - Download the latest release from our [GitHub repository](https://github.com/incpi/Dark-CPI-Web-Extension) then go to bin folder.
   - Extract the downloaded archive.
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top-right corner.
   - Click "Load unpacked" and select the extracted folder.

## Usage

Using the Dark CPI Extension is straightforward:

1. Open your SAP CPI environment.
2. The extension will automatically apply the dark theme to your interface or select from extension icon on top in browser besides URL if pin it.

Addtionally we support SAP BUILD and Theme Designer

## Theme Customization

The Dark CPI Extension allows you to customize the theme by specifying a URL parameter. This Feature enables you to choose from a variety of predefined themes.

### Using the URL Parameter for only SAP CPI (not for SAP BUILD) (Update: Temporary debug purpose , Replaced with UI)

To select a specific theme, append the `darkcpi` parameter to the URL of your SAP CPI environment, followed by the desired theme value. For example:from design page, `https://your-sap-cpi-environment.ondamand.com/shell/design?darkcpi=theme-value`

Replace `theme-value` with one of the valid keys from the `themeMap` object.

### Available Themes

The extension comes with the following predefined themes:

- `0`: Morning Horizon - New Theme By SAP
- `1`: Evening Horizon - Dark Theme similar to New UI
- `2`: Quartz Light - Previous UI Theme before Morning Horizon

> [!NOTE] any other theme by SAP is not compatible with this extension.

### Custom Themes

If you want to create your own custom theme, you can modify the `themeMap` object in the source code. Add a new key-value pair, where the key represents the theme name (to be used in the URL parameter), and the value is an object containing the CSS styles for your custom theme.

## Changelogs

### Versioning Scheme

- **Format**: `Major.Minor.Maintenance.Build`
  - **Major**: Significant changes or new features.
  - **Minor**: Small features or improvements.
  - **Maintenance**: Bug fixes or minor updates.
  - **Build** (optional): Used for internal purposes such as build numbers or source control revisions. This number will not appear in the changelog and is only included in maintenance versions.

### v1.3.6

- [Feature] Unix & ISO time stamp converter addedin popup
- [Improvement] load time was decreased by optimizing the extension runtime.
- [BugFix] Events includes further minor UI tweaks and consistent bit order
- [Release] Adding Release on github to quickly get binary via github.
- [BugFix] Toolbar will not be compromised with Super Easy extension.

### v1.3.5

- [Bugfix] Corrected the CPI panel display issue on search.
- [Improvement] Optimized the extension size, reducing it from 2 MB to approximately 350 KB.
- [Improvement] Limited CSS overwrites to ensure a seamless native experience.

### v1.3.4

- [Feature] Added support for addtional **SAP CPI - fka HCI / old Tenents**
- [BugFix] User prefer schema (Light/dark) will not effect UI with CPI Helper
- [Bugfix] UI changes fixes.

### v1.3.3

- [Bugfix] SAP UI theme Horizon dark fix (Trace half screnn non visible)
- [Bugfix] Mapping fields are invisible in mmap Files.
- [Bugfix] Simulation error color is not correct.
- [Feature] Now supports addtional application such as **SAP Builds workzone** and it's theme designer.
- [Improvement] UI changes for popup.

### v1.2.0

- [Feature] Automatically closes the navigation bar on startup.
- [Feature] Added in **Edge Store**
- [Bugfix] SAP UI theme Horizon fix
- [Improvement] UI improvement: select theme from extension icon

### v1.1.0

- [BugFix] Added support for Mapping pages.
- [Feature] Change theme from Popup page.

### v1.0.0

- Dark theme for SAP CPI. Initial public version.

## Code of Conduct

We are committed to fostering an open and welcoming environment for all contributors and users. Please adhere to our [Code of Conduct](/CODE_OF_CONDUCT.md), which outlines the expected behavior and guidelines for participation in this project.

## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1. **Fork the Repository:** Click the "Fork" button at the top of our GitHub page.
2. **Clone Your Fork:** Use `git clone <your-fork-url>` to clone your fork to your local machine.
3. **Create a Branch:** Use `git checkout -b feature-branch` to create a new branch for your feature or bugfix.
4. **Make Changes:** Implement your changes.
5. **Commit and Push:** Use `git commit -m "Description of changes"` and `git push origin feature-branch`.
6. **Create a Pull Request:** Submit a pull request to our repository.

> [!IMPORTANT]  
> No 3rd party lib is allowed in minified version. If you want to include then it should be uncompressed version So that we can review / set other environment as `ISOLATED` for security reasons.

Please refer to our [Contribution Guidelines](/CONTRIBUTING.md) for more detailed information.

## Code Review Guidelines

To ensure the highest quality of code and maintain the project's integrity, we have established strict guidelines for code reviews:

- **Security:** Verify that your code does not introduce security vulnerabilities.

We appreciate your patience and cooperation during the review process.

## Stargazers [![Stargazers](https://reporoster.com/stars/dark/notext/Incpi/Dark-CPI-Web-Extension)](https://github.com/Incpi/Dark-CPI-Web-Extension/stargazers)

## Support

If you have any questions, issues, or suggestions, please feel free to [open an issue](https://github.com/incpi/Dark-CPI-Web-Extension/issues) on GitHub.

Thank you for using the Dark CPI Extension! We hope it enhances your SAP experience.
