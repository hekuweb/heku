import { Rocket } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/**
 * Layout component that wraps all pages with header and navigation
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2 font-heading hover:opacity-90 transition-opacity">
            <Rocket size={32} weight="fill" className="text-brand-secondary" />
            Heku
          </Link>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout

