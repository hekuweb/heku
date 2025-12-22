import { resolveLink } from '../lib/contentfulPages'
import HeroCard from './HeroCard'
import PhosphorIcon from './PhosphorIcon'

/**
 * Component to render a Page Hero V2 section from Contentful
 * Features: title, subtitle, highlights (list items), and feature cards
 * @param {Object} props
 * @param {Object} props.heroSection - The hero section entry from Contentful
 * @param {Object} props.includes - The includes object from Contentful response for resolving assets
 */
function PageHeroV2({ heroSection, includes }) {
  if (!heroSection || !heroSection.fields) {
    return null
  }

  const fields = heroSection.fields

  // Resolve highlights (array of listItem entries)
  const highlights = (fields.highlights || [])
    .map((highlight) => {
      if (highlight.fields) {
        return highlight
      } else if (highlight.sys) {
        return resolveLink(highlight, includes)
      }
      return null
    })
    .filter(Boolean)

  // Resolve cards (array of card entries, max 2)
  const cards = (fields.cards || [])
    .map((card) => {
      if (card.fields) {
        return card
      } else if (card.sys) {
        return resolveLink(card, includes)
      }
      return null
    })
    .filter(Boolean)

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[75%] px-6 lg:px-8 py-10 lg:py-12">
        {/* Main Hero Section - Split Layout */}
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
          {/* Left Side - Title and Subtitle */}
          <div className="col-span-2">
            <div className="lg:max-w-full">
              {fields.titleText && (
                <h1 className="text-4xl font-heading tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  {fields.titleText} <img src="https://res.cloudinary.com/heku/image/upload/f_webp/q_auto/v1765984303/heku-blue_m4rl3o.svg" alt="Heku Logo" className="h-11 w-auto inline mb-[16px]" />
                </h1>
              )}
              {fields.subtitleText && (
                <p className="mt-6 text-lg leading-8 text-gray-600 font-body">
                  {fields.subtitleText}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Highlights */}
          {highlights.length > 0 && (
            <div className="self-center col-span-1">
              <div className="space-y-6 justify-self-end">
                {highlights.map((highlight, index) => {
                  const fields = highlight.fields || {}
                  return (
                    <div key={index} className="flex items-center gap-4">
                      {/* Icon or Label */}
                      <div className="flex-shrink-0">
                        {fields.itemIcon ? (
                          <PhosphorIcon 
                            iconName={fields.itemIcon} 
                            size={24} 
                            weight="regular" 
                            className="text-gray-900"
                          />
                        ) : (
                          fields.itemLabel && (
                            <span className="text-lg font-semibold text-gray-500">
                              {fields.itemLabel}
                            </span>
                          )
                        )}
                      </div>
                      {/* Title */}
                      {fields.itemTitle && (
                        <span className="text-base font-body text-gray-900">
                          {fields.itemTitle}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards - Below Hero Section */}
        {cards.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {cards.map((card, index) => (
              <HeroCard
                key={index}
                cardEntry={card}
                includes={includes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeroV2
