import { useState, useEffect } from 'react'
import { getPageBySlug } from '../lib/contentfulPages'

/**
 * Custom hook to fetch a page by slug from Contentful
 * @param {string} slug - The slug of the page to fetch
 * @returns {Object} { page, loading, error }
 */
export function usePage(slug) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true)
        setError(null)
        const pageData = await getPageBySlug(slug)
        setPage(pageData)
      } catch (err) {
        setError(err)
        console.error('Error fetching page:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    } else {
      setLoading(false)
    }
  }, [slug])

  return { page, loading, error }
}

