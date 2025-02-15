import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import { routes } from './configs/routes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {/* <Navbar /> */}
        <main>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
