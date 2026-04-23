import { createBrowserRouter } from 'react-router-dom'
import AppShell from '../views/components/layout/AppShell'
import Projects from '../views/projects/Projects'
import Project from '../views/project/Project'
import NotFound from '../pages/NotFound'
import Login from '../pages/Login'
import RequireAuth from './RequireAuth'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <RequireAuth><AppShell /></RequireAuth>,
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
