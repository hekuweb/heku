# Contentful Setup Guide

## Page Content Type

To use the page routing system, you need to create a **Page** content type in Contentful with the following fields:

### Required Fields

1. **slug** (Short text, required)
   - The URL path where the page should be accessible
   - For the homepage, use: `/`
   - For other pages, use paths like: `/about`, `/contact`, `/services`, etc.
   - This field must be unique

2. **title** (Short text, required)
   - The page title/heading

3. **content** (Long text or Rich text, optional)
   - The main content of the page
   - Can be plain text or rich text depending on your needs

### Example Pages

#### Homepage
- **slug**: `/`
- **title**: `Welcome to Heku`
- **content**: `Your homepage content here...`

#### About Page
- **slug**: `/about`
- **title**: `About Us`
- **content**: `About page content here...`

## Content Type ID

The content type must be named exactly: **`page`** (lowercase)

## Setting Up in Contentful

1. Go to your Contentful space
2. Navigate to Content model
3. Click "Add content type"
4. Name it `page`
5. Add the fields as described above
6. Save and publish the content type
7. Create your pages with the appropriate slugs

## Environment Variables

Make sure you have set up your `.env` file with:

```
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

## How It Works

- The app uses React Router to handle routing
- When a user visits a URL, the `Page` component fetches the page from Contentful using the slug
- The slug is derived from the URL pathname
- If no page is found for a slug, a 404 page is displayed

