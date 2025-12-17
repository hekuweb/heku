import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Page from './components/Page'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Catch-all route that handles all paths based on slug */}
          <Route path="*" element={<Page />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

