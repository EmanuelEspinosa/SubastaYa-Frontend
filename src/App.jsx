import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { MainLayout } from './layout/MainLayout/MainLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home/Home'
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />}/>
            <Route path="categoria/:categoriaId" element={<Home />} />
            <Route path="/subasta/:id" element={<ItemDetailContainer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
