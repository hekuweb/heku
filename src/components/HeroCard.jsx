import { resolveLink } from '../lib/contentfulPages'
import CTA from './CTA'

/**
 * Hero Card component for PageHeroV2
 * Features: background image, large title, subtitle/price, and CTA button
 * @param {Object} props
 * @param {Object} props.cardEntry - The card entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function HeroCard({ cardEntry, includes }) {
  if (!cardEntry || !cardEntry.fields) {
    return null
  }

  const fields = cardEntry.fields

  // Resolve background image
  let backgroundImageUrl = null
  let backgroundImageAlt = ''
  
  // Check for background image fields
  const backgroundImageFields = ['backgroundImage', 'background', 'image', 'heroImage']
  for (const fieldName of backgroundImageFields) {
    if (fields[fieldName]) {
      let imageEntry = null
      
      if (fields[fieldName].fields) {
        imageEntry = fields[fieldName]
      } else if (fields[fieldName].sys) {
        imageEntry = resolveLink(fields[fieldName], includes)
      }
      
      if (imageEntry) {
        const imageEntryFields = imageEntry.fields || {}
        
        // Check if it's a Cloudinary image entry
        if (imageEntryFields.image && Array.isArray(imageEntryFields.image) && imageEntryFields.image.length > 0) {
          backgroundImageUrl = imageEntryFields.image[0].secure_url || imageEntryFields.image[0].url
          backgroundImageAlt = imageEntryFields.altText || ''
        }
        // Check if it's a Contentful asset
        else if (imageEntryFields.file) {
          backgroundImageUrl = imageEntryFields.file.url ? `https:${imageEntryFields.file.url}` : null
          backgroundImageAlt = imageEntryFields.title || imageEntryFields.description || ''
        }
      }
      
      if (backgroundImageUrl) break
    }
  }

  // Resolve product image (for right side overlay)
  let productImageUrl = null
  let productImageAlt = ''
  
  const productImageFields = ['productImage', 'product', 'overlayImage']
  for (const fieldName of productImageFields) {
    if (fields[fieldName]) {
      let imageEntry = null
      
      if (fields[fieldName].fields) {
        imageEntry = fields[fieldName]
      } else if (fields[fieldName].sys) {
        imageEntry = resolveLink(fields[fieldName], includes)
      }
      
      if (imageEntry) {
        const imageEntryFields = imageEntry.fields || {}
        
        if (imageEntryFields.image && Array.isArray(imageEntryFields.image) && imageEntryFields.image.length > 0) {
          productImageUrl = imageEntryFields.image[0].secure_url || imageEntryFields.image[0].url
          productImageAlt = imageEntryFields.altText || ''
        }
        else if (imageEntryFields.file) {
          productImageUrl = imageEntryFields.file.url ? `https:${imageEntryFields.file.url}` : null
          productImageAlt = imageEntryFields.title || imageEntryFields.description || ''
        }
      }
      
      if (productImageUrl) break
    }
  }

  // Get background color (fallback if no image)
  const backgroundColor = fields.backgroundColor || fields.background || ''

  // Resolve CTA
  let ctaEntry = null
  if (fields.cta) {
    if (fields.cta.fields) {
      ctaEntry = fields.cta
    } else if (fields.cta.sys) {
      ctaEntry = resolveLink(fields.cta, includes)
    }
  }

  // Get title and subtitle
  const title = fields.cardTitle || fields.title || ''
  const subtitle = fields.shortDescription || fields.subtitle || fields.price || ''

  return (
    <div 
      className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/3] sm:aspect-[3/2]"
      style={{
        backgroundColor: backgroundColor || undefined,
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Image */}
      {backgroundImageUrl && (
        <img
          src={backgroundImageUrl}
          alt={backgroundImageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10">
        {/* Top Section - Title and Subtitle (Top-Left Quadrant) */}
        <div className="flex-1 flex flex-col justify-start z-10">
          {title && (
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white mb-3 max-w-[80%] leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-base text-white font-body max-w-[65%]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom Section - CTA Button (Bottom-Left) */}
        {ctaEntry && ctaEntry.fields && (
          <div className="z-10">
            <div className="inline-block">
              <CTA
                ctaLabel={ctaEntry.fields.ctaLabel}
                ctaLink={ctaEntry.fields.ctaLink}
                icon={ctaEntry.fields.icon}
                openInNewTab={ctaEntry.fields.openInNewTab}
                style={ctaEntry.fields.style || 'White'}
                // Legacy support
                text={ctaEntry.fields.text}
                url={ctaEntry.fields.url}
                showArrow={ctaEntry.fields.showArrow !== false}
              />
            </div>
          </div>
        )}

        {/* Product Image Overlay (Right Side - Can extend beyond card) */}
        {productImageUrl && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 sm:w-2/5 flex items-center justify-end pr-0 overflow-visible z-0">
            <img
              src={productImageUrl}
              alt={productImageAlt}
              className="max-h-[90%] w-auto object-contain"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroCard
