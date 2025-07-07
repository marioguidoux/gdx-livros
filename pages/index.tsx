import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [itens, setItens] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true)
      let query = supabase.from('sua_tabela').select('*').limit(1000)
      if (busca) {
        query = query.ilike('titulo', `%${busca}%`) // ajuste o campo
      }
      const { data } = await query
      setItens(data || [])
      setCarregando(false)
    }
    carregar()
  }, [busca])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <input
        className="border p-2 w-full mb-4"
        placeholder="Buscar..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      {carregando ? <p>Carregando...</p> : null}
      <ul>
        {itens.map((item) => (
          <li key={item.id} className="border-b py-2">
            <strong>{item.titulo}</strong><br />
            {item.descricao}
          </li>
        ))}
      </ul>
    </div>
  )
}
