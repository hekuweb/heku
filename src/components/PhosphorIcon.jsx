import * as PhosphorIcons from '@phosphor-icons/react'

/**
 * Convert kebab-case or lowercase to PascalCase
 * @param {string} str - The string to convert
 * @returns {string} PascalCase string
 */
function toPascalCase(str) {
  if (!str) return str
  
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Component to dynamically render Phosphor icons by name
 * @param {Object} props
 * @param {string} props.iconName - The name of the Phosphor icon (e.g., "ArrowUpRight", "Globe", "brain", "globe-hemisphere-east")
 * @param {Object} props.props - Additional props to pass to the icon component
 */
function PhosphorIcon({ iconName, ...props }) {
  if (!iconName) {
    return null
  }

  // Convert icon name to PascalCase (handles both kebab-case and lowercase)
  const pascalCaseName = toPascalCase(iconName)
  const IconComponent = PhosphorIcons[pascalCaseName]

  if (!IconComponent) {
    console.warn(`Phosphor icon "${iconName}" (converted to "${pascalCaseName}") not found`)
    return null
  }

  return <IconComponent {...props} />
}

export default PhosphorIcon
