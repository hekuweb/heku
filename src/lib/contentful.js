import { createClient } from 'contentful'

// Contentful client configuration
// Replace these with your actual Contentful space ID and access token
// You can get these from your Contentful space settings
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
})

export default client

