import { resolveLink } from '../lib/contentfulPages'
import Card from './Card'
import CTA from './CTA'

/**
 * Component to render a card group from Contentful
 * Contains: optional title, subtitle, groupCta, and an array of cards
 * @param {Object} props
 * @param {Object} props.cardGroupEntry - The card group entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function CardGroup({ cardGroupEntry, includes }) {
  if (!cardGroupEntry || !cardGroupEntry.fields) {
    return null
  }

  const fields = cardGroupEntry.fields
  const cards = fields.cards || []

  // Resolve all cards
  const resolvedCards = cards
    .map((card) => {
      if (card.fields) {
        return card
      } else if (card.sys) {
        return resolveLink(card, includes)
      }
      return null
    })
    .filter(Boolean)

  if (resolvedCards.length === 0) {
    return null
  }

  // Resolve groupCta if it exists
  let groupCtaEntry = null
  if (fields.groupCta) {
    if (fields.groupCta.fields) {
      groupCtaEntry = fields.groupCta
    } else if (fields.groupCta.sys) {
      groupCtaEntry = resolveLink(fields.groupCta, includes)
    }
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Optional Title and Subtitle */}
        {(fields.title || fields.subtitle) && (
          <div className="mb-12 text-center">
            {fields.title && (
              <h2 className="text-4xl font-heading text-gray-900 mb-4">
                {fields.title}
              </h2>
            )}
            {fields.subtitle && (
              <p className="text-lg text-gray-600 font-body">
                {fields.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resolvedCards.map((card, index) => (
            <Card
              key={index}
              cardEntry={card}
              includes={includes}
            />
          ))}
        </div>

        {/* Optional Group CTA */}
        {groupCtaEntry && groupCtaEntry.fields && (
          <div className="mt-12 text-center">
            <CTA
              text={groupCtaEntry.fields.text || 'Learn More'}
              url={groupCtaEntry.fields.url || '#'}
              showArrow={groupCtaEntry.fields.showArrow !== false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CardGroup
