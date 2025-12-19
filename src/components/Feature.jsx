import { resolveLink } from '../lib/contentfulPages'
import RichText from './RichText'
import CardGroup from './CardGroup'
import ContentImage from './ContentImage'

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
 * Handles different content types: rich text, images, and card groups
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

  // Check for image fields (common field names)
  const imageFields = ['image', 'imageAsset', 'photo', 'picture']
  let imageField = null
  
  for (const fieldName of imageFields) {
    if (fields[fieldName]) {
      imageField = fields[fieldName]
      break
    }
  }

  // Render rich text if available
  if (richTextDocument) {
    return (
      <div className="feature-content">
        <RichText richTextDocument={richTextDocument} includes={includes} />
      </div>
    )
  }

  // Render image if available (and no rich text)
  if (imageField) {
    return (
      <div className="feature-content">
        <ContentImage imageField={imageField} includes={includes} />
      </div>
    )
  }

  // Fallback: render other common fields
  return (
    <div className="feature-content">
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
