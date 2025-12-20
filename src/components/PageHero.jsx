import { resolveLink } from '../lib/contentfulPages'
import CTA from './CTA'

/**
 * Component to render a hero section from Contentful
 * Tailwind UI "Split with bordered screenshot" design pattern
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

  // Resolve CTA if present
  let ctaEntry = null
  if (fields.cta) {
    if (fields.cta.fields) {
      // Already resolved
      ctaEntry = fields.cta
    } else if (fields.cta.sys) {
      // Need to resolve from includes
      ctaEntry = resolveLink(fields.cta, includes)
    }
  }

  return (
    <div className="bg-white md:h-[60dvh] content-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Text Content - Left Side */}
          <div className="lg:pr-8 lg:pt-4 content-center">
            <div className="lg:max-w-lg">
              {fields.titleText && (
                <h1 className="text-8xl font-heading tracking-tight text-gray-900 sm:text-8xl lg:text-8xl">
                  {fields.titleText} <img src="https://res.cloudinary.com/heku/image/upload/v1765984302/heku-gold_hebclv.svg" alt="Heku Logo" className="h-16 w-auto inline mb-[18px]" />
                </h1>
              )}
              {fields.subtitleText && (
                <p className="mt-6 text-lg leading-8 text-gray-600 font-body">
                  {fields.subtitleText}
                </p>
              )}
              {/* CTA */}
              {ctaEntry && ctaEntry.fields && (
                <div className="mt-10">
                  <CTA
                    ctaLabel={ctaEntry.fields.ctaLabel}
                    ctaLink={ctaEntry.fields.ctaLink}
                    icon={ctaEntry.fields.icon}
                    openInNewTab={ctaEntry.fields.openInNewTab}
                    style={ctaEntry.fields.style}
                    // Legacy support
                    text={ctaEntry.fields.text}
                    url={ctaEntry.fields.url}
                    showArrow={ctaEntry.fields.showArrow !== false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Screenshot - Right Side */}
          {imageUrl && (
            <div className="lg:pr-8 lg:pt-4">
              <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 sm:pb-12 sm:pt-80 lg:mx-0 lg:max-w-none lg:px-16 lg:pb-16 lg:pt-96">
                <img
                  src={imageUrl}
                  alt={altText}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHero
