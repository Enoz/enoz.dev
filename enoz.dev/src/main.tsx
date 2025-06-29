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
    dark:
      [
        "#f5f5f5",
        "#e7e7e7",
        "#cdcdcd",
        "#b2b2b2",
        "#9a9a9a",
        "#8b8b8b",
        "#848484",
        "#717171",
        "#141414",
        "#000000"
      ]
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
