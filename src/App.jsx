import { Rocket, Heart, Cube } from '@phosphor-icons/react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 font-heading">
            <Rocket size={32} weight="fill" className="text-brand-secondary" />
            Heku
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-brand-primary mb-4 font-heading">
            Welcome to Heku
          </h2>
          <p className="text-gray-600 mb-8 font-body">
            Your website is ready. Start building with Contentful, React, and Tailwind CSS.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex flex-col items-center gap-2">
              <Heart size={32} weight="fill" className="text-brand-error" />
              <span className="text-xs text-gray-500">Error</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cube size={32} weight="duotone" className="text-brand-success" />
              <span className="text-xs text-gray-500">Success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Rocket size={32} weight="bold" className="text-brand-warning" />
              <span className="text-xs text-gray-500">Warning</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

