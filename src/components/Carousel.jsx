import { resolveLink } from '../lib/contentfulPages'

/**
 * Component to render a carousel of client logos from Contentful
 * Handles carousel content type with title and carouselItems (array of client entries)
 * @param {Object} props
 * @param {Object} props.carouselEntry - The carousel entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function Carousel({ carouselEntry, includes }) {
  if (!carouselEntry || !carouselEntry.fields) {
    return null
  }

  const fields = carouselEntry.fields
  const carouselItems = fields.carouselItems || []

  // Resolve all carousel items (client entries)
  const resolvedItems = carouselItems
    .map((item) => {
      // Check if already resolved (has fields property)
      if (item.fields) {
        return item
      } else if (item.sys) {
        // Needs to be resolved from includes
        return resolveLink(item, includes)
      }
      return null
    })
    .filter(Boolean) // Remove any null entries

  if (resolvedItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title */}
        {fields.title && (
          <p className="text-sm font-semibold leading-7 text-gray-400 font-body mb-8">
            {fields.title}
          </p>
        )}

        {/* Logo carousel */}
        <div className="flex items-center gap-x-[40px] gap-y-12 overflow-x-auto pb-4 scrollbar-hide px-[40px]">
          {resolvedItems.map((client, index) => {
            const clientFields = client.fields || {}
            
            // Resolve image entry if it exists - check logoDark first
            // Check if image is already resolved (has fields) or needs to be resolved (has sys)
            let imageEntry = null
            if (clientFields.logoDark) {
              if (clientFields.logoDark.fields) {
                // Already resolved
                imageEntry = clientFields.logoDark
              } else if (clientFields.logoDark.sys) {
                // Needs to be resolved
                imageEntry = resolveLink(clientFields.logoDark, includes)
              }
            } else if (clientFields.image) {
              if (clientFields.image.fields) {
                // Already resolved
                imageEntry = clientFields.image
              } else if (clientFields.image.sys) {
                // Needs to be resolved
                imageEntry = resolveLink(clientFields.image, includes)
              }
            } else if (clientFields.logo) {
              // Fallback to logo field if logoDark and image don't exist
              if (clientFields.logo.fields) {
                imageEntry = clientFields.logo
              } else if (clientFields.logo.sys) {
                imageEntry = resolveLink(clientFields.logo, includes)
              }
            }

            // Extract image URL from Cloudinary data (same pattern as PageHero)
            let imageUrl = null
            let altText = clientFields.name || clientFields.entryTitle || 'Client logo'

            if (imageEntry) {
              const imageEntryFields = imageEntry.fields || {}
              
              // Extract image URL from Cloudinary data
              // The image entry has an image field which is an array with Cloudinary URLs
              const imageData = imageEntryFields.image
              
              if (imageData && Array.isArray(imageData) && imageData.length > 0) {
                imageUrl = imageData[0].secure_url || imageData[0].url
                altText = imageEntryFields.altText || altText
              } 
              // Fallback: Check if it's a Contentful asset
              else if (imageEntryFields.file) {
                imageUrl = imageEntryFields.file.url ? `https:${imageEntryFields.file.url}` : null
                altText = imageEntryFields.title || imageEntryFields.description || altText
              }
            }

            if (!imageUrl) {
              return null
            }

            return (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={imageUrl}
                  alt={altText}
                  className="h-8 w-auto object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Carousel
