import { HashRouter, Routes, Route } from 'react-router-dom'
// import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import { routes } from './configs/routes'
import './App.css'

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}

export default App
