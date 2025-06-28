import '@mantine/core/styles.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import Home from './components/Home/Home.tsx'
import { MantineProvider, createTheme } from '@mantine/core'


const theme = createTheme({
  colors: {
    primaryGreen: [
      '#e6ffee',
      '#d3f9e0',
      '#a8f2c0',
      '#7aea9f',
      '#54e382',
      '#3bdf70',
      '#2bdd66',
      '#1bc455',
      '#0bae4a',
      '#00973c'
    ],
  },
  primaryColor: 'primaryGreen'
});

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} defaultColorScheme='dark'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
)
