import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Map = Record<string, string>

export default function useSiteContent() {
  const [content, setContent] = useState<Map>({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_content')
      .select('key,value')

    if (!error && data) {
      const map: Map = {}
      data.forEach((i: any) => (map[i.key] = i.value))
      setContent(map)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()

    // TEMP: disable realtime to prevent production crash
    return () => {}
  }, [])

  return { content, loading }
}
