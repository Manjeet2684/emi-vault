import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductListPage } from './pages/ProductListPage'

function ProductDetailRoute() {
  const { slug } = useParams()
  return <ProductDetailPage key={slug} />
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-slate-50 text-slate-900">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailRoute />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
