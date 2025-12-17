# Heku Website

A modern website for Heku built with React, Tailwind CSS, Contentful CMS, and deployed on Netlify.

## Tech Stack

- **React** - Front-end framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Contentful** - Headless CMS
- **Netlify** - Hosting and deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Contentful account and space

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Contentful Space ID and Access Token:
     ```
     VITE_CONTENTFUL_SPACE_ID=your_space_id_here
     VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
     ```
   - You can find these in your Contentful space settings under API keys

### Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

Build the project:
```bash
npm run build
```

The production build will be in the `dist` directory.

### Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Add your environment variables in Netlify's site settings:
   - `VITE_CONTENTFUL_SPACE_ID`
   - `VITE_CONTENTFUL_ACCESS_TOKEN`

### Project Structure

```
heku/
├── src/
│   ├── lib/
│   │   └── contentful.js    # Contentful client configuration
│   ├── App.jsx              # Main App component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template
├── netlify.toml            # Netlify configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Using Contentful

The Contentful client is already configured in `src/lib/contentful.js`. You can import and use it in your components:

```javascript
import contentfulClient from './lib/contentful'

// Example: Fetch entries
const entries = await contentfulClient.getEntries({
  content_type: 'yourContentType'
})
```

## License

Copyright © Heku

