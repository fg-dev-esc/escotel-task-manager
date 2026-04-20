import { useState, useEffect, use } from 'react'
import { obtenerConteoTareas } from '../../services/tasks'

export function useProjectStats(projectId) {
  const [stats, setStats] = useState({ todo: 0, in_progress: 0, in_review: 0, done: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) {
      setStats({ todo: 0, in_progress: 0, in_review: 0, done: 0 })
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      setLoading(true)
      try {
        const data = await obtenerConteoTareas(projectId)
        setStats(data)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [projectId])

  return { stats, loading }
}