import { resolveLink } from '../lib/contentfulPages'

/**
 * Component to render an image from Contentful
 * Handles both direct Cloudinary arrays and linked image entries
 * @param {Object} props
 * @param {Object} props.imageField - The image field from Contentful (can be array or linked entry)
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 * @param {string} props.className - Additional CSS classes for the image
 * @param {string} props.alt - Alt text for the image (optional, will try to extract from image data)
 */
function ContentImage({ imageField, includes, className = '', alt = '' }) {
  if (!imageField) {
    return null
  }

  let imageUrl = null
  let imageAlt = alt

  // Check if it's an array of Cloudinary images directly
  if (Array.isArray(imageField) && imageField.length > 0) {
    const firstImage = imageField[0]
    if (firstImage && (firstImage.secure_url || firstImage.url)) {
      imageUrl = firstImage.secure_url || firstImage.url
      imageAlt = firstImage.altText || imageAlt
    }
  }
  // Check if it's a linked entry
  else {
    let imageEntry = null
    
    // Check if image is already resolved (has fields) or needs to be resolved (has sys)
    if (imageField.fields) {
      imageEntry = imageField
    } else if (imageField.sys) {
      imageEntry = resolveLink(imageField, includes)
    }
    
    if (imageEntry) {
      const imageEntryFields = imageEntry.fields || {}
      
      // Check if it's a Cloudinary image entry
      if (imageEntryFields.image && Array.isArray(imageEntryFields.image) && imageEntryFields.image.length > 0) {
        imageUrl = imageEntryFields.image[0].secure_url || imageEntryFields.image[0].url
        imageAlt = imageEntryFields.altText || imageAlt
      }
      // Check if it's a Contentful asset
      else if (imageEntryFields.file) {
        imageUrl = imageEntryFields.file.url ? `https:${imageEntryFields.file.url}` : null
        imageAlt = imageEntryFields.title || imageEntryFields.description || imageAlt
      }
    }
  }

  if (!imageUrl) {
    return null
  }

  return (
    <div className="mb-6">
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`w-full h-auto rounded-3xl ${className}`}
      />
    </div>
  )
}

export default ContentImage
