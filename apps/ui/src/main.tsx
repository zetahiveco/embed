import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app'
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import SessionProvider from './providers/sessionProvider';

const theme = extendTheme({
  fonts: {
    heading: `"Space Grotesk", sans-serif`,
    body: `"Space Grotesk", sans-serif`
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
