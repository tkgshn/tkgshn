# tkgshn.com - Personal Portfolio Website

This repository hosts the personal portfolio website for **Taka**, Shunsuke Takagi （高木俊輔）, an independent researcher and freelance IT consultant based in Tokyo.

Visit the live site: [tkgshn.com](https://tkgshn.com)

## About Taka

- Independent Researcher and Freelance IT Consultant 💻
  - Expertise in UI Architecture and Product Management
  - Passionate about social welfare services, digital public goods, and digital democracy
- Based in Tokyo 🗼, sometimes living a nomadic life around the world 🌎
- Professional backpacker traveling with just one bag. Motto: "Stay cheap, eat fancy" 🎒🍷

## Repository Structure

This repository is organized as follows:

```
tkgshn/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── devin-update.md    # Template for Devin-assisted updates
│   └── workflows/
│       └── static.yml         # GitHub Actions workflow for validation and deployment
├── .well-known/
│   ├── _config.yml            # Configuration for .well-known directory
│   └── nostr.json             # Nostr NIP-05 identity verification
├── content/
│   └── main.md                # Main content in Markdown format
├── CNAME                      # Custom domain configuration
├── index.html                 # Main HTML file with styling and scripts
└── README.md                  # This documentation file
```

## Features

### 1. Content Management

The website content is separated from the HTML structure:
- All content is stored in Markdown format in the `content/main.md` file
- The HTML file dynamically loads and renders this content
- This separation makes it easier to update content without touching HTML

### 2. HTML Validation

Automated HTML validation is implemented in the GitHub Actions workflow:
- Uses html-validate to check for HTML errors
- Runs on every push and pull request
- Prevents deployment of invalid HTML

### 3. Automated Release Process

The site uses semantic versioning for releases:
- Automatically creates releases based on commit messages
- Uses semantic-release for version management
- Generates release notes automatically

### 4. GitHub Issue-based Updates with Devin

You can request updates to the website by creating a GitHub issue using the Devin template:
1. Go to Issues > New Issue
2. Select the "Devin Website Update" template
3. Fill in the required information
4. Assign to Devin or mention @Devin in the issue

### 5. Responsive Design

The website is designed to be responsive:
- Adapts to different screen sizes
- Images scale properly on mobile devices
- Flex layouts adjust for smaller screens

## How to Update Content

### Option 1: Direct Edit (For Developers)

1. Clone the repository
2. Edit the `content/main.md` file
3. Commit and push your changes
4. GitHub Actions will automatically validate and deploy your changes

### Option 2: GitHub Issue (For Non-Developers)

1. Create a new issue using the Devin template
2. Provide the content you want to add or modify
3. Specify where the content should be placed
4. Devin will make the changes and create a pull request

## Development

### Local Setup

1. Clone the repository:
   ```
   git clone https://github.com/tkgshn/tkgshn.git
   cd tkgshn
   ```

2. Open `index.html` in your browser to preview the site

### Testing

- HTML validation: `npx html-validate index.html`
- Mobile responsiveness: Use browser developer tools to test different screen sizes

## License

All rights reserved. The content and code in this repository are not licensed for reuse without permission.
