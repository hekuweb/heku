import Navigation from './Navigation'

/**
 * Layout component that wraps all pages with header and navigation
 * The Navigation component appears on all pages since it's in the Layout
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

export default Layout

