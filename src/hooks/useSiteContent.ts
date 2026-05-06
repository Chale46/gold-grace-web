import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Map = Record<string, string>

export default function useSiteContent() {
  const [content, setContent] = useState<Map>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    load()

    // optional realtime (nice for demo)
    const ch = supabase
      .channel('site_content')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_content' 
      }, (payload) => {
        console.log('Realtime update:', payload)
        load() // Reload content when changes occur
      })
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [])

  return { content, loading }
}
