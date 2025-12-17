import contentfulClient from './contentful'

/**
 * Fetch navigation data by entry ID from Contentful
 * Includes linked entries for navigationItems and logo
 * @param {string} entryId - The Contentful entry ID
 * @returns {Promise<Object>} Object with entry and includes
 */
export async function getNavigationById(entryId) {
  try {
    // Include linked entries (navigationItems and logo)
    // getEntry with include returns the entry, but we need to also get includes
    // Using getEntries with a filter to get the entry and its includes
    const query = {
      'sys.id': entryId,
      include: 10, // Include up to 10 levels of linked entries
      limit: 1,
    }
    
    const response = await contentfulClient.getEntries(query)
    
    if (response.items.length === 0) {
      console.error('❌ Navigation entry not found with ID:', entryId)
      throw new Error('Navigation entry not found')
    }
    
    const entry = response.items[0]
    
    // Return both the entry and includes
    const result = {
      entry: entry,
      includes: response.includes || {},
    }
    return result
  } catch (error) {
    console.error('❌ Error fetching navigation from Contentful:', error)
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
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
  if (!link || !link.sys) return null
  
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

