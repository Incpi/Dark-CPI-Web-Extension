<img src="./images/Black_full.png" class="center" alt="icon"><h1>Web Extension for SAP CPI </h1>

Welcome to the Dark SAP CPI Web Extension for SAP CPI repository! This open-source project provides a sleek, dark interface for your SAP Cloud Platform Integration (CPI) environment, enhancing visual comfort and overall user experience.
 
## Privacy and data protection
The plugin does not collect personal data. Nevertheless the stores like Chrome Web Store collect some anonymous data like how many users have the plugin installed. We do not trust 3rd party library & tools so we implemented our own solution instead of library to ensure security for logging in browser but nothing is stored or sent to any server by this plugin.

We guarantee:
- No personal data / tenant information is collected. 
- It is open source so feel free to check the source code or your network console.

## Installation

> [!WARNING]  
> No Firefox browser support yet.

To install the SAP CPI Dark Mode Extension, please follow these steps:

1. **Download the Extension:**
   - Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/dark-sap-cpi/lmegddleeigeddljmdkonofmppbefneo) and search for "SAP CPI Dark Mode."
   - Click "Add to Chrome" to install the extension.

2. **Manual Installation:**
   - Download the latest release from our [GitHub repository](https://github.com/incpi/Dark-CPI-Web-Extension) then go to bin folder.
   - Extract the downloaded archive.
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top-right corner.
   - Click "Load unpacked" and select the extracted folder.

## Usage

Using the SAP CPI Dark Mode Extension is straightforward:

1. Open your SAP CPI environment.
2. The extension will automatically apply the dark theme to your interface.

## Theme Customization

The SAP CPI Dark Mode Extension allows you to customize the theme by specifying a URL parameter. This feature enables you to choose from a variety of predefined themes or create your own custom theme.

### Using the URL Parameter

To select a specific theme, append the `darkcpi` parameter to the URL of your SAP CPI environment, followed by the desired theme value. For example:from design page,
`https://your-sap-cpi-environment.ondamand.com/shell/design?darkcpi=theme-value`

Replace `theme-value` with one of the valid keys from the `themeMap` object.

### Available Themes

The extension comes with the following predefined themes:
- `0`: Morning Horizon - New Theme By SAP
- `1`: Evening Horizon - Dark Theme similar to New UI
- `2`: Quartz Light - Previous UI Theme before Morning Horizon
  
> [!NOTE] any other theme by SAP is not compatible with this extension.

### Custom Themes

If you want to create your own custom theme, you can modify the `themeMap` object in the source code. Add a new key-value pair, where the key represents the theme name (to be used in the URL parameter), and the value is an object containing the CSS styles for your custom theme.

## Changelog

### v1.2.0
- [Feature] Automatically closes the navigation bar on startup.

### v1.1.0
- [BugFix] Added support for Mapping pages.
- [Feature] Change theme from Popup page.

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
> No 3rd party lib is allowed in minified version. If you want to include then it should be uncompressed version So that we can review / set other environment as `ISOLATED` for security reasons.

Please refer to our [Contribution Guidelines](#) for more detailed information.

## Code Review Guidelines

To ensure the highest quality of code and maintain the project's integrity, we have established strict guidelines for code reviews:
- **Security:** Verify that your code does not introduce security vulnerabilities.

We appreciate your patience and cooperation during the review process.

## Support
If you have any questions, issues, or suggestions, please feel free to [open an issue](https://github.com/incpi/Dark-CPI-Web-Extension/issues) on GitHub.

Thank you for using the SAP CPI Dark Mode Extension! We hope it enhances your SAP CPI experience.
