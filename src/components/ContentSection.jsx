import RichText from './RichText'
import ContentImage from './ContentImage'

/**
 * Component to render a generic content section from Contentful
 * Handles images, rich text, and other content fields
 * @param {Object} props
 * @param {Object} props.contentEntry - The content entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function ContentSection({ contentEntry, includes }) {
  console.log('📄 ContentSection - Received contentEntry:', contentEntry)
  console.log('📄 ContentSection - Received includes:', includes)
  
  if (!contentEntry || !contentEntry.fields) {
    console.log('❌ ContentSection - No contentEntry or fields, returning null')
    return null
  }

  const fields = contentEntry.fields
  console.log('📄 ContentSection - Fields:', fields)
  console.log('📄 ContentSection - Field keys:', Object.keys(fields))

  // Check for image fields (common field names)
  const imageFields = ['image', 'imageAsset', 'photo', 'picture']
  let imageField = null
  
  for (const fieldName of imageFields) {
    if (fields[fieldName]) {
      imageField = fields[fieldName]
      console.log(`🖼️ ContentSection - Found image field "${fieldName}":`, imageField)
      break
    }
  }
  
  if (!imageField) {
    console.log('❌ ContentSection - No image field found')
  }

  // Check for rich text fields (common field names)
  const richTextFields = ['content', 'body', 'text', 'description', 'richText', 'richContent']
  let richTextDocument = null
  
  for (const fieldName of richTextFields) {
    if (fields[fieldName] && fields[fieldName].nodeType === 'document') {
      richTextDocument = fields[fieldName]
      break
    }
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Image - full width within max-w-7xl, outside max-w-4xl */}
        {imageField && (
          <ContentImage
            imageField={imageField}
            includes={includes}
          />
        )}

        <div className="mx-auto">
          {/* Rich Text Content */}
          {richTextDocument && (
            <RichText richTextDocument={richTextDocument} includes={includes} />
          )}

          {/* Fallback: render other common fields if no rich text */}
          {!richTextDocument && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentSection
