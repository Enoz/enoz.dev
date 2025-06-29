import '@mantine/core/styles.css'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MantineProvider, createTheme } from '@mantine/core'
import App from './App'
import { BrowserRouter } from 'react-router'

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
      '#00973c',
    ],
    dark: [
      '#f0f0f0',
      '#d2d2d2',
      '#b5b5b5',
      '#999999',
      '#7e7e7e',
      '#636363',
      '#4a4a4a',
      '#333333',
      '#1d1d1d',
      '#000000',
    ],
  },
  primaryColor: 'primaryGreen',
})

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
)
