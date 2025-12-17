import { useLocation } from 'react-router-dom'
import { usePage } from '../hooks/usePage'

/**
 * Component to render a page from Contentful based on the current route slug
 */
function Page() {
  const location = useLocation()
  // Get the current pathname (slug) from the URL
  // Ensure we use "/" for root, otherwise use the pathname
  const slug = location.pathname === '/' ? '/' : location.pathname
  const { page, loading, error } = usePage(slug)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-error font-body">Error loading page: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading text-brand-primary mb-4">Page Not Found</h1>
          <p className="text-gray-600 font-body">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Extract fields from the Contentful entry
  const fields = page.fields || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Render page content here */}
      {/* This structure will depend on your Contentful content model */}
      {fields.title && (
        <h1 className="text-4xl font-heading text-brand-primary mb-6">
          {fields.title}
        </h1>
      )}
      
      {fields.content && (
        <div className="prose prose-lg max-w-none font-body text-gray-700">
          {/* Render rich text content - you may need to use @contentful/rich-text-react-renderer */}
          <p>{typeof fields.content === 'string' ? fields.content : 'Content available'}</p>
        </div>
      )}
    </div>
  )
}

export default Page

