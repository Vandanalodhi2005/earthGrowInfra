'use client'

import { Provider } from 'react-redux'
import { store } from '../store'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster position="top-right" />
          {children}
        </Provider>
      </body>
    </html>
  )
}
