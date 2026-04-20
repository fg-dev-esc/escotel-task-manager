import { createBrowserRouter } from 'react-router-dom'
import AppShell from '../views/components/layout/AppShell'
import Projects from '../views/projects/Projects'
import Project from '../views/project/Project'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Projects />,
      },
      {
        path: ':id',
        element: <Project />,
      },
    ],
  },
])