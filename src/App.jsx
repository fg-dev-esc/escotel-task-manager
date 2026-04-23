import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AreasProvider } from './hooks/useAreas.jsx'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <AreasProvider>
        <RouterProvider router={router} />
      </AreasProvider>
    </AuthProvider>
  )
}
