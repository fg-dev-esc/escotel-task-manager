import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ProjectProvider } from './hooks/useProjects.jsx'

export default function App() {
  return (
    <ProjectProvider>
      <RouterProvider router={router} />
    </ProjectProvider>
  )
}
