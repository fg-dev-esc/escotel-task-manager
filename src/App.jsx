import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AreasProvider } from './hooks/useAreas.jsx'

export default function App() {
  return (
    <AreasProvider>
      <RouterProvider router={router} />
    </AreasProvider>
  )
}
