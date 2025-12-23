import PhosphorIcon from './PhosphorIcon'

/**
 * ListItem component for rendering list items in Rich Text
 * Displays Item Label (number) or Item Icon, along with Item Title and Item Text
 * @param {Object} props
 * @param {string} props.itemLabel - The label/number for the item (e.g., "01", "02")
 * @param {string} props.itemIcon - Optional Phosphor icon name (overrides itemLabel if provided)
 * @param {string} props.itemTitle - The title text for the item
 * @param {string} props.itemText - Optional additional text/description for the item
 */
function ListItem({ itemLabel, itemIcon, itemTitle, itemText }) {
  // Render if we have at least one of: itemTitle, itemText, itemLabel, or itemIcon
  if (!itemTitle && !itemText && !itemLabel && !itemIcon) {
    return null
  }

  return (
    <div className="rich-text-list-item flex items-start gap-4 py-6 border-t border-gray-200 last:border-b-0">
      {/* Item Label or Icon */}
      <div className="flex-shrink-0">
        {itemIcon ? (
          <PhosphorIcon 
            iconName={itemIcon} 
            size={24} 
            weight="duotone" 
            className="text-gray-500"
          />
        ) : (
          itemLabel && (
            <span className="text-lg font-semibold text-gray-500">
              {itemLabel}
            </span>
          )
        )}
      </div>

      {/* Item Title and Text */}
      <div className="flex-1 min-w-0">
        {itemTitle && (
          <h3 className="text-base font-body text-gray-900 mb-1">
            {itemTitle}
          </h3>
        )}
        {itemText && (
          <p className={`text-sm font-body text-gray-600 ${itemTitle ? '' : 'mt-0'}`}>
            {itemText}
          </p>
        )}
      </div>
    </div>
  )
}

export default ListItem
