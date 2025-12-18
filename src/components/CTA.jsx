import { ArrowUpRight } from '@phosphor-icons/react'

/**
 * CTA (Call-to-Action) component
 * Renders a button with text and optional arrow icon
 * @param {Object} props
 * @param {string} props.text - The button text (default: "Learn More")
 * @param {string} props.url - The URL to link to
 * @param {boolean} props.showArrow - Whether to show the arrow icon (default: true)
 */
function CTA({ text = 'Learn More', url, showArrow = true }) {
  if (!url) {
    return null
  }

  return (
    <a
      href={url}
      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-body hover:bg-brand-primary/90 transition-colors"
    >
      <span>{text}</span>
      {showArrow && <ArrowUpRight size={16} weight="bold" />}
    </a>
  )
}

export default CTA
