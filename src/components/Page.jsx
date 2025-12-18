import { useLocation } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { resolveLink } from '../lib/contentfulPages'
import PageHero from './PageHero'
import Carousel from './Carousel'
import Feature from './Feature'
import CardGroup from './CardGroup'
import ContentSection from './ContentSection'

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-brand-error font-body">Error loading page: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!page || !page.entry) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading text-brand-primary mb-4">Page Not Found</h1>
          <p className="text-gray-600 font-body">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Extract fields from the Contentful entry
  const fields = page.entry.fields || {}
  const includes = page.includes || {}

  // Process content array to find different content types
  let pageHero = null
  const contentSections = []
  
  if (fields.content && Array.isArray(fields.content)) {
    // Check each content item - Contentful may return them already resolved or as links
    for (const contentItem of fields.content) {
      let resolvedContent = null
      
      // Check if already resolved (has fields property)
      if (contentItem.fields) {
        resolvedContent = contentItem
      } else if (contentItem.sys && contentItem.sys.linkType === 'Entry') {
        // Needs to be resolved from includes
        resolvedContent = resolveLink(contentItem, includes)
      }
      
      if (!resolvedContent) continue
      
      // Check contentType to determine how to render
      const contentTypeId = resolvedContent?.sys?.contentType?.sys?.id
      
      if (contentTypeId === 'pageHero') {
        pageHero = resolvedContent
      } else if (contentTypeId === 'carousel') {
        contentSections.push({ type: 'carousel', entry: resolvedContent })
      } else if (contentTypeId === 'feature') {
        contentSections.push({ type: 'feature', entry: resolvedContent })
      } else if (contentTypeId === 'cardGroup') {
        contentSections.push({ type: 'cardGroup', entry: resolvedContent })
      } else if (contentTypeId === 'content' || contentTypeId === 'contentSection') {
        contentSections.push({ type: 'content', entry: resolvedContent })
      } else {
        // Other content types can be added here
        contentSections.push({ type: 'unknown', entry: resolvedContent })
      }
    }
  }

  return (
    <>
      {/* Render hero section if it exists */}
      {pageHero && (
        <PageHero heroSection={pageHero} includes={includes} />
      )}

      {/* Render content sections */}
      {contentSections.map((section, index) => {
        if (section.type === 'carousel') {
          return (
            <Carousel
              key={index}
              carouselEntry={section.entry}
              includes={includes}
            />
          )
        }
        if (section.type === 'feature') {
          return (
            <Feature
              key={index}
              featureEntry={section.entry}
              includes={includes}
            />
          )
        }
        if (section.type === 'cardGroup') {
          return (
            <CardGroup
              key={index}
              cardGroupEntry={section.entry}
              includes={includes}
            />
          )
        }
        if (section.type === 'content') {
          return (
            <ContentSection
              key={index}
              contentEntry={section.entry}
              includes={includes}
            />
          )
        }
        // Render unknown content types as ContentSection as well
        if (section.type === 'unknown') {
          return (
            <ContentSection
              key={index}
              contentEntry={section.entry}
              includes={includes}
            />
          )
        }
        return null
      })}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Render page title only if there's no hero section (hero section has its own title) */}
        {!pageHero && fields.title && (
          <h1 className="text-4xl font-heading text-brand-primary mb-6">
            {fields.title}
          </h1>
        )}
      </div>
    </>
  )
}

export default Page

