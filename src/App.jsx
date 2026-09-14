import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { MainLayout } from './layout/MainLayout/MainLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
