import PhosphorIcon from './PhosphorIcon'

/**
 * CTA (Call-to-Action) component
 * Renders a button with text and optional icon
 * Supports both old format (text, url, showArrow) and new format (ctaLabel, ctaLink, icon, openInNewTab, style)
 * @param {Object} props
 * @param {string} props.text - The button text (legacy, default: "Learn More")
 * @param {string} props.url - The URL to link to (legacy)
 * @param {boolean} props.showArrow - Whether to show the arrow icon (legacy, default: true)
 * @param {string} props.ctaLabel - The button text (new format)
 * @param {string} props.ctaLink - The URL to link to (new format)
 * @param {string} props.icon - The Phosphor icon name (e.g., "arrow-up-right")
 * @param {boolean} props.openInNewTab - Whether to open link in new tab
 * @param {string} props.style - The button style (e.g., "Primary Brand Blue")
 */
function CTA({ 
  text, 
  url, 
  showArrow = true,
  ctaLabel,
  ctaLink,
  icon,
  openInNewTab = false,
  style
}) {
  // Support both old and new format
  const label = ctaLabel || text || 'Learn More'
  const link = ctaLink || url
  
  if (!link) {
    return null
  }

  // Determine if we should show an icon
  let showIcon = false
  let iconName = null
  
  if (icon) {
    // New format: use the specified icon
    showIcon = true
    iconName = icon
  } else if (showArrow) {
    // Legacy format: use arrow-up-right if showArrow is true
    showIcon = true
    iconName = 'arrow-up-right'
  }

  // Determine button style based on style prop
  let buttonClassName = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-body transition-colors"
  
  if (style === 'Primary Brand Blue' || !style) {
    buttonClassName += " bg-brand-primary text-white hover:bg-brand-primary/90"
  } else {
    // Default to primary style if style is not recognized
    buttonClassName += " bg-brand-primary text-white hover:bg-brand-primary/90"
  }

  const linkProps = {
    href: link,
    className: buttonClassName,
    ...(openInNewTab && {
      target: '_blank',
      rel: 'noopener noreferrer'
    })
  }

  return (
    <a {...linkProps}>
      <span>{label}</span>
      {showIcon && iconName && (
        <PhosphorIcon iconName={iconName} size={16} weight="bold" />
      )}
    </a>
  )
}

export default CTA
