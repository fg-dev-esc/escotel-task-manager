import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AreasProvider } from './hooks/useAreas.jsx'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider } from 'antd'
import { lightTheme } from './lib/antd-theme'

export default function App() {
  return (
    <ConfigProvider theme={lightTheme}>
      <AuthProvider>
        <AreasProvider>
          <RouterProvider router={router} />
        </AreasProvider>
      </AuthProvider>
    </ConfigProvider>
  )
}
