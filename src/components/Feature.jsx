import { resolveLink } from '../lib/contentfulPages'
import RichText from './RichText'
import CardGroup from './CardGroup'

/**
 * Component to render a feature section from Contentful
 * Handles different layout styles: "Large Left", "Large Right", "50/50", or "Full"
 * @param {Object} props
 * @param {Object} props.featureEntry - The feature entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function Feature({ featureEntry, includes }) {
  if (!featureEntry || !featureEntry.fields) {
    return null
  }

  const fields = featureEntry.fields
  const style = fields.style || '50/50'

  // Resolve content left and right
  let contentLeft = null
  let contentRight = null

  if (fields.contentLeft) {
    if (fields.contentLeft.fields) {
      contentLeft = fields.contentLeft
    } else if (fields.contentLeft.sys) {
      contentLeft = resolveLink(fields.contentLeft, includes)
    }
  }

  if (fields.contentRight) {
    if (fields.contentRight.fields) {
      contentRight = fields.contentRight
    } else if (fields.contentRight.sys) {
      contentRight = resolveLink(fields.contentRight, includes)
    }
  }

  // Render based on style
  switch (style) {
    case 'Large Left':
      return (
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Large Left Content */}
              <div className="lg:col-span-2">
                {contentLeft && (
                  <FeatureContent content={contentLeft} includes={includes} />
                )}
              </div>
              {/* Small Right Content */}
              <div className="lg:col-span-1">
                {contentRight && (
                  <FeatureContent content={contentRight} includes={includes} />
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case 'Large Right':
      return (
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Small Left Content */}
              <div className="lg:col-span-1">
                {contentLeft && (
                  <FeatureContent content={contentLeft} includes={includes} />
                )}
              </div>
              {/* Large Right Content */}
              <div className="lg:col-span-2">
                {contentRight && (
                  <FeatureContent content={contentRight} includes={includes} />
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case '50/50':
      return (
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Content */}
              <div>
                {contentLeft && (
                  <FeatureContent content={contentLeft} includes={includes} />
                )}
              </div>
              {/* Right Content */}
              <div>
                {contentRight && (
                  <FeatureContent content={contentRight} includes={includes} />
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case 'Full':
      return (
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {contentLeft && (
                <FeatureContent content={contentLeft} includes={includes} />
              )}
              {contentRight && (
                <FeatureContent content={contentRight} includes={includes} />
              )}
            </div>
          </div>
        </div>
      )

    default:
      // Default to 50/50 if style is unknown
      return (
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                {contentLeft && (
                  <FeatureContent content={contentLeft} includes={includes} />
                )}
              </div>
              <div>
                {contentRight && (
                  <FeatureContent content={contentRight} includes={includes} />
                )}
              </div>
            </div>
          </div>
        </div>
      )
  }
}

/**
 * Helper component to render feature content
 * Handles different content types and renders rich text fields
 */
function FeatureContent({ content, includes }) {
  if (!content || !content.fields) {
    return null
  }

  const fields = content.fields
  const contentTypeId = content.sys?.contentType?.sys?.id

  // Handle cardGroup content type
  if (contentTypeId === 'cardGroup') {
    return <CardGroup cardGroupEntry={content} includes={includes} />
  }

  // Check for rich text fields (common field names)
  const richTextFields = ['content', 'body', 'text', 'description', 'richText', 'richContent']
  
  // Find the first rich text field
  let richTextDocument = null
  for (const fieldName of richTextFields) {
    if (fields[fieldName] && fields[fieldName].nodeType === 'document') {
      richTextDocument = fields[fieldName]
      break
    }
  }

  // If we have rich text, render it
  if (richTextDocument) {
    return (
      <div className="feature-content">
        <RichText richTextDocument={richTextDocument} includes={includes} />
      </div>
    )
  }

  // Check for image fields (common field names)
  const imageFields = ['image', 'imageAsset', 'photo', 'picture']
  let imageUrl = null
  let imageAlt = ''
  
  for (const fieldName of imageFields) {
    if (fields[fieldName]) {
      let imageEntry = null
      
      // Check if image is already resolved (has fields) or needs to be resolved (has sys)
      if (fields[fieldName].fields) {
        imageEntry = fields[fieldName]
      } else if (fields[fieldName].sys) {
        imageEntry = resolveLink(fields[fieldName], includes)
      }
      
      if (imageEntry) {
        const imageEntryFields = imageEntry.fields || {}
        
        // Check if it's a Cloudinary image entry
        if (imageEntryFields.image && Array.isArray(imageEntryFields.image) && imageEntryFields.image.length > 0) {
          imageUrl = imageEntryFields.image[0].secure_url || imageEntryFields.image[0].url
          imageAlt = imageEntryFields.altText || ''
        }
        // Check if it's a Contentful asset
        else if (imageEntryFields.file) {
          imageUrl = imageEntryFields.file.url ? `https:${imageEntryFields.file.url}` : null
          imageAlt = imageEntryFields.title || imageEntryFields.description || ''
        }
      }
      
      if (imageUrl) break
    }
  }

  // Fallback: render other common fields
  return (
    <div className="feature-content">
      {/* Image - full width, auto height, rounded corners */}
      {imageUrl && (
        <div className="mb-6">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {fields.title && (
        <h2 className="text-2xl font-heading text-gray-900 mb-4">{fields.title}</h2>
      )}
      {fields.heading && (
        <h2 className="text-2xl font-heading text-gray-900 mb-4">{fields.heading}</h2>
      )}
      {fields.subtitle && (
        <h3 className="text-xl font-heading text-gray-700 mb-3">{fields.subtitle}</h3>
      )}
      {fields.description && typeof fields.description === 'string' && (
        <p className="text-gray-600 font-body mb-4">{fields.description}</p>
      )}
      {fields.text && typeof fields.text === 'string' && (
        <p className="text-gray-600 font-body mb-4">{fields.text}</p>
      )}
    </div>
  )
}

export default Feature
