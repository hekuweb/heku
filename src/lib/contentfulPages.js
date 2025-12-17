import contentfulClient from './contentful'

/**
 * Fetch a page by its slug from Contentful
 * @param {string} slug - The slug of the page (e.g., "/" for homepage, "/about" for about page)
 * @returns {Promise<Object|null>} The page entry or null if not found
 */
export async function getPageBySlug(slug) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
    })

    if (response.items.length === 0) {
      return null
    }

    return response.items[0]
  } catch (error) {
    console.error('Error fetching page from Contentful:', error)
    throw error
  }
}

/**
 * Fetch all pages from Contentful
 * @returns {Promise<Array>} Array of all page entries
 */
export async function getAllPages() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'page',
      limit: 1000, // Adjust based on your needs
    })

    return response.items
  } catch (error) {
    console.error('Error fetching pages from Contentful:', error)
    throw error
  }
}

