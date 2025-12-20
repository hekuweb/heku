import { useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Rocket, X, List } from '@phosphor-icons/react'
import { useNavigation } from '../hooks/useNavigation'
import CTA from './CTA'

/**
 * Navigation component with flyout menus
 * Fetches navigation structure from Contentful entry ID: 3ZjNFcZRoGEgnFhMynwo1Y
 */
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFlyouts, setOpenFlyouts] = useState({})
  const location = useLocation()
  const { navigation, includes, loading, error } = useNavigation()

  const toggleFlyout = (key) => {
    setOpenFlyouts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const closeAllFlyouts = () => {
    setOpenFlyouts({})
  }
  
  // Parse navigation data from Contentful
  // Structure: navigationItems is an array of linked entries
  const navigationItems = navigation?.fields?.navigationItems || []
  const logoLink = navigation?.fields?.logo
  const ctaLink = navigation?.fields?.cta

  
  // Helper function to resolve a link
  const resolveLink = (link, linkType = 'Entry') => {
    if (!link || !link.sys) return null
    
    const id = link.sys.id
    
    if (linkType === 'Asset' && includes?.Asset) {
      return includes.Asset.find((asset) => asset.sys.id === id) || null
    }
    
    if (linkType === 'Entry' && includes?.Entry) {
      return includes.Entry.find((entry) => entry.sys.id === id) || null
    }
    
    // If link is already resolved (has fields), return it
    if (link.fields) {
      return link
    }
    
    return null
  }
  
  // Resolve logo if present
  // Logo is already resolved in the entry (it's an Entry of type "image")
  let logo = null
  let logoAltText = 'Logo'
  
  if (logoLink) {
    if (logoLink.fields) {
      // Already resolved - it's an Entry with image field
      // The image field is an array, get the first item
      const imageArray = logoLink.fields.image || []
      if (imageArray.length > 0) {
        logo = imageArray[0]
        logoAltText = logoLink.fields.altText || 'Logo'
      }
    } else if (logoLink.sys?.linkType === 'Asset') {
      logo = resolveLink(logoLink, 'Asset')
      if (logo) {
        logoAltText = logo.fields?.title || logo.fields?.description || 'Logo'
      }
    } else if (logoLink.sys?.linkType === 'Entry') {
      const logoEntry = resolveLink(logoLink, 'Entry')
      if (logoEntry?.fields?.image) {
        const imageArray = logoEntry.fields.image
        if (imageArray.length > 0) {
          logo = imageArray[0]
          logoAltText = logoEntry.fields.altText || 'Logo'
        }
      }
    }
  }
  // Resolve navigation items from linked entries
  // Note: navigationItems are already resolved (they have fields)
  const resolvedNavItems = navigationItems
    .map((item, index) => {
      
      // Items are already resolved, so check if they have fields
      let fields = null
      if (item.fields) {
        // Already resolved
        fields = item.fields
      } else {
        // Try to resolve from includes
        const entry = resolveLink(item, 'Entry')
        if (!entry) {
          return null
        }
        fields = entry.fields || {}
      }
      
      // Get the navigation title - field name is "navigationTitle"
      const name = fields.navigationTitle || fields.name || fields.label || fields.title || fields.entryTitle || ''
      
      // Get href/slug - check multiple possible field names
      const href = fields.href || fields.slug || fields.path || 
                   (name ? `/${name.toLowerCase().replace(/\s+/g, '-')}` : '#')
      
      // Handle nested children if they exist
      let children = null
      const childLinks = fields.children || fields.subItems || fields.navigationItems || []
      if (childLinks.length > 0) {
        children = childLinks
          .map((childLink) => {
            let childFields = null
            if (childLink.fields) {
              childFields = childLink.fields
            } else {
              const childEntry = resolveLink(childLink, 'Entry')
              if (!childEntry) return null
              childFields = childEntry.fields || {}
            }
            
            const childName = childFields.navigationTitle || childFields.name || childFields.label || childFields.title || childFields.entryTitle || ''
            const childHref = childFields.href || childFields.slug || childFields.path || 
                             (childName ? `/${childName.toLowerCase().replace(/\s+/g, '-')}` : '#')
            
            return {
              name: childName,
              href: childHref,
              description: childFields.description || null,
            }
          })
          .filter(Boolean)
      }
      
      return {
        name: name,
        href: href,
        description: fields.description || null,
        items: children && children.length > 0 ? children : null,
      }
    })
    .filter(Boolean)

  // Default navigation structure if Contentful data is not available
  const defaultNavItems = [
    {
      name: 'Home',
      href: '/',
    },
  ]

  const items = resolvedNavItems.length > 0 ? resolvedNavItems : defaultNavItems

  // Resolve CTA if present
  let ctaEntry = null
  if (ctaLink) {
    if (ctaLink.fields) {
      // Already resolved
      ctaEntry = ctaLink
    } else if (ctaLink.sys) {
      // Need to resolve from includes
      ctaEntry = resolveLink(ctaLink, 'Entry')
    }
  }

  if (loading) {
    return (
      <header className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
              </Link>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  if (error) {
    console.error('Navigation error:', error)
  }

  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              {logo ? (
                <img 
                  src={logo.secure_url || logo.url || ''} 
                  alt={logoAltText} 
                  className="h-8 w-auto" 
                  onError={(e) => {
                    console.error('Logo image failed to load:', logo)
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <Rocket size={32} weight="fill" className="text-brand-secondary" />
              )}
            </Link>
          </div>
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-8">
              {items.map((item, index) => {
                const hasChildren = item.items && item.items.length > 0
                const itemKey = `nav-${index}`

                if (hasChildren) {
                  return (
                    <div
                      key={itemKey}
                      className="relative"
                      onMouseEnter={() => toggleFlyout(itemKey)}
                      onMouseLeave={() => closeAllFlyouts()}
                    >
                      <button
                        type="button"
                        className="flex items-center gap-x-1 text-sm font-body font-semibold leading-6 text-gray-900"
                        aria-expanded={openFlyouts[itemKey]}
                      >
                        {item.name}
                        <svg className="h-5 w-5 flex-none text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {openFlyouts[itemKey] && (
                        <div className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1">
                              {item.items.map((subItem, subIndex) => (
                                <Link
                                  key={`sub-${subIndex}`}
                                  to={subItem.href || subItem.slug || '#'}
                                  className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                  onClick={closeAllFlyouts}
                                >
                                  <div className="flex-auto">
                                    <span className="block font-body font-semibold text-gray-900">
                                      {subItem.name}
                                      <span className="absolute inset-0" />
                                    </span>
                                    {subItem.description && (
                                      <span className="mt-1 block font-body text-gray-600">{subItem.description}</span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={itemKey}
                    to={item.href || item.slug || '#'}
                    className={`text-m font-body font-semibold leading-6 ${
                      location.pathname === (item.href || item.slug)
                        ? 'text-brand-primary'
                        : 'text-gray-900 hover:text-brand-primary transition-colors'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center flex-1 justify-end gap-4">
            {/* CTA - Desktop */}
            {ctaEntry && ctaEntry.fields && (
              <div className="hidden lg:block">
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
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <List className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10" />
            <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 -m-1.5 p-1.5">
                  {logo ? (
                    <img 
                      src={logo.secure_url || logo.url || ''} 
                      alt={logoAltText} 
                      className="h-6 w-auto" 
                      onError={(e) => {
                        console.error('Logo image failed to load in mobile menu:', logo)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <Rocket size={24} weight="fill" className="text-brand-secondary" />
                  )}
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {items.map((item, index) => {
                      const hasChildren = item.items && item.items.length > 0
                      const itemKey = `mobile-nav-${index}`

                      if (hasChildren) {
                        return (
                          <div key={itemKey}>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between py-2 text-base font-body font-semibold leading-7 text-gray-900"
                              onClick={() => toggleFlyout(itemKey)}
                            >
                              {item.name}
                              <svg
                                className={`h-5 w-5 flex-none ${openFlyouts[itemKey] ? 'rotate-180' : ''} transition-transform`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {openFlyouts[itemKey] && (
                              <div className="mt-2 space-y-2 pl-4">
                                {item.items.map((subItem, subIndex) => (
                                  <Link
                                    key={`mobile-sub-${subIndex}`}
                                    to={subItem.href || subItem.slug || '#'}
                                    className="block py-2 text-sm font-body leading-6 text-gray-600 hover:text-brand-primary"
                                    onClick={() => {
                                      setMobileMenuOpen(false)
                                      closeAllFlyouts()
                                    }}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={itemKey}
                          to={item.href || item.slug || '#'}
                          className={`-mx-3 block rounded-lg px-3 py-2 text-base font-body font-semibold leading-7 ${
                            location.pathname === (item.href || item.slug)
                              ? 'text-brand-primary bg-gray-50'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                  {/* CTA - Mobile */}
                  {ctaEntry && ctaEntry.fields && (
                    <div className="py-6 border-t border-gray-500/10">
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
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navigation

