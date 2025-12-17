import { useState, useEffect } from 'react'
import { getNavigationById } from '../lib/contentfulNavigation'

const NAVIGATION_ENTRY_ID = '3ZjNFcZRoGEgnFhMynwo1Y'

/**
 * Custom hook to fetch navigation data from Contentful
 * @returns {Object} { navigation, includes, loading, error }
 */
export function useNavigation() {
  const [navigation, setNavigation] = useState(null)
  const [includes, setIncludes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNavigation() {
      try {
        setLoading(true)
        setError(null)
        const response = await getNavigationById(NAVIGATION_ENTRY_ID)
        // Response contains entry and includes
        setNavigation(response.entry)
        setIncludes(response.includes || {})
      } catch (err) {
        setError(err)
        console.error('❌ Error fetching navigation:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNavigation()
  }, [])

  return { navigation, includes, loading, error }
}

