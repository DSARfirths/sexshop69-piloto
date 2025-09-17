export default function SpecsTable({specs}:{specs:Record<string,string|number|boolean>}){
  const entries = Object.entries(specs)
  if (!entries.length) return null
  return (
    <div className="border rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3">Especificaciones</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {entries.map(([k,v])=> (
          <div key={k} className="flex">
            <dt className="w-40 text-neutral-500 capitalize">{k}</dt>
            <dd className="flex-1 font-medium">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
