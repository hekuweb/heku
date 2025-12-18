import { resolveLink } from '../lib/contentfulPages'
import CTA from './CTA'
import PhosphorIcon from './PhosphorIcon'

/**
 * Component to render a card from Contentful
 * Contains: title, icon, short description, and CTA
 * @param {Object} props
 * @param {Object} props.cardEntry - The card entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function Card({ cardEntry, includes }) {
  if (!cardEntry || !cardEntry.fields) {
    return null
  }

  const fields = cardEntry.fields

  // Get icon name - could be a string directly or from a linked entry
  let iconName = null
  if (fields.icon) {
    // If icon is a string (direct reference)
    if (typeof fields.icon === 'string') {
      iconName = fields.icon
    }
    // If icon is a linked entry, resolve it and get the icon name
    else {
      let iconEntry = null
      if (fields.icon.fields) {
        iconEntry = fields.icon
      } else if (fields.icon.sys) {
        iconEntry = resolveLink(fields.icon, includes)
      }
      
      // Get icon name from the entry (could be in different fields)
      if (iconEntry?.fields) {
        iconName = iconEntry.fields.iconName || iconEntry.fields.name || iconEntry.fields.entryTitle
      }
    }
  }

  // Resolve CTA if it exists
  let ctaEntry = null
  if (fields.cta) {
    if (fields.cta.fields) {
      ctaEntry = fields.cta
    } else if (fields.cta.sys) {
      ctaEntry = resolveLink(fields.cta, includes)
    }
  }

  return (
    <div className="flex flex-col pt-8 border-t border-grey-500">
      {/* Icon */}
      {iconName && (
        <div className="mb-4">
          <PhosphorIcon iconName={iconName} size={24} weight="regular" className="text-black" />
        </div>
      )}

      {/* Title */}
      {fields.cardTitle && (
        <h3 className="text-xl font-heading text-gray-900 mb-3">
          {fields.cardTitle}
        </h3>
      )}

      {/* Short Description */}
      {fields.shortDescription && (
        <p className="text-gray-600 font-body mb-6 leading-relaxed flex-grow">
          {fields.shortDescription}
        </p>
      )}

      {/* CTA */}
      {ctaEntry && ctaEntry.fields && (
        <div className="mt-auto">
          <CTA
            text={ctaEntry.fields.text || 'Learn More'}
            url={ctaEntry.fields.url || '#'}
            showArrow={ctaEntry.fields.showArrow !== false}
          />
        </div>
      )}
    </div>
  )
}

export default Card
