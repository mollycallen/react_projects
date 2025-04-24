import { useState, useEffect } from 'react'

export function useFetch (url, options) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(url, options)
        if (!res.ok) {
          throw new Error(`HTTP error status: ${res.status}`)
        }
        const jsonData = await res.json()
        setData(jsonData)
        setIsLoading(false)
        setErrorMessage(null)
      } catch (error) {
        setErrorMessage(error)
        console.log('useFetch error: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [url, options])

  return { data, isLoading, errorMessage }
}
