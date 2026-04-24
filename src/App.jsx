import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AreasProvider } from './hooks/useAreas.jsx'
import { ConfigProvider } from 'antd'
import { lightTheme } from './lib/antd-theme'

export default function App() {
  return (
    <ConfigProvider theme={lightTheme}>
      <AreasProvider>
        <RouterProvider router={router} />
      </AreasProvider>
    </ConfigProvider>
  )
}
