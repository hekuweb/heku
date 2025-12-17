import contentfulClient from './contentful'

/**
 * Fetch a page by its slug from Contentful
 * Includes linked entries (e.g., heroSection, content sections)
 * @param {string} slug - The slug of the page (e.g., "/" for homepage, "/about" for about page)
 * @returns {Promise<Object|null>} Object with entry and includes, or null if not found
 */
export async function getPageBySlug(slug) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 10, // Include up to 10 levels of linked entries
      limit: 1,
    })

    if (response.items.length === 0) {
      return null
    }

    const entry = response.items[0]

    // Return both the entry and includes for resolving linked entries
    return {
      entry: entry,
      includes: response.includes || {},
    }
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

/**
 * Resolve a linked entry from the includes
 * @param {Object} link - The link object from Contentful
 * @param {Object} includes - The includes object from the Contentful response
 * @returns {Object|null} The resolved entry or null
 */
export function resolveLink(link, includes) {
  if (!link || !link.sys) {
    return null
  }
  
  const { id, linkType } = link.sys
  
  if (linkType === 'Entry') {
    // Find in Entry array
    const entry = includes?.Entry?.find((e) => e.sys.id === id)
    return entry || null
  }
  
  if (linkType === 'Asset') {
    // Find in Asset array
    const asset = includes?.Asset?.find((a) => a.sys.id === id)
    return asset || null
  }
  
  return null
}

