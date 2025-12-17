import { resolveLink } from '../lib/contentfulPages'

/**
 * Component to render a hero section from Contentful
 * Tailwind UI "With app screenshot" design pattern
 * Handles pageHero content type with titleText, subtitleText, and image
 * @param {Object} props
 * @param {Object} props.heroSection - The hero section entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function PageHero({ heroSection, includes }) {
  if (!heroSection || !heroSection.fields) {
    return null
  }

  const fields = heroSection.fields

  // Resolve image entry if it exists (image is a linked entry)
  // Check if image is already resolved (has fields) or needs to be resolved (has sys)
  let imageEntry = null
  if (fields.image) {
    if (fields.image.fields) {
      // Already resolved
      imageEntry = fields.image
    } else if (fields.image.sys) {
      // Needs to be resolved
      imageEntry = resolveLink(fields.image, includes)
    }
  }

  // Extract image URL from Cloudinary data
  // The image entry has an image field which is an array with Cloudinary URLs
  const imageData = imageEntry?.fields?.image
  const imageUrl = imageData && imageData.length > 0
    ? imageData[0].secure_url || imageData[0].url
    : null

  // Get alt text from image entry
  const altText = imageEntry?.fields?.altText || ''

  return (
    <div className="bg-white">
      <div className="mx-auto w-full mt-6 px-12 lg:px-12">
        <div className="mx-auto w-full">
          <div className="flex flex-col items-center gap-y-16">
            {/* Text Content - Centered */}
            <div className="text-center">
              {fields.titleText && (
                <h1 className="text-6xl font-heading tracking-tight text-gray-900 sm:text-8xl lg:text-9xl">
                  {fields.titleText}
                </h1>
              )}
              {fields.subtitleText && (
                <p className="mt-6 text-lg leading-8 text-gray-600 font-body">
                  {fields.subtitleText}
                </p>
              )}
            </div>

            {/* App Screenshot - Centered below text */}
            {imageUrl && (
              <div className="w-full relative">
                {/* Decorative rectangle - full width, behind image, positioned at bottom */}
                <div className="absolute inset-0 flex items-end justify-center z-0">
                  <div 
                    className="w-full h-[75%] rounded-3xl"
                    style={{
                      background: 'linear-gradient(196deg,rgba(41, 35, 92, 1) 25%, rgba(202, 158, 103, 1) 100%)'
                    }}
                  ></div>
                </div>
                
                {/* Image container - centered */}
                <div className="relative z-10 mx-auto max-w-4xl overflow-hidden rounded-t-3xl shadow-2xl border-[20px] border-t-black border-r-black border-l-black border-b-0">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHero
