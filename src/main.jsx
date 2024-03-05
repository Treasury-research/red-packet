import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { router } from './router.jsx'
import { MetaMaskProvider } from '@metamask/sdk-react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <MetaMaskProvider debug={false} sdkOptions={{
      dappMetadata: {
        name: 'Red Packet',
        url: window.location.href,
      }
    }}>
      <RouterProvider router={router} />
    </MetaMaskProvider>
  </ChakraProvider>,
)
