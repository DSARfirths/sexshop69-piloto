import { formatAttributeLabel, formatAttributeValue, getProductProperties } from '@/lib/products'
import type { ProductAttributes, Specs } from '@/lib/products'

type SpecsTableProps = {
  attributes?: ProductAttributes
  specs?: Specs
}

export default function SpecsTable({ attributes, specs }: SpecsTableProps) {
  const entries = getProductProperties(attributes, specs)
  if (!entries.length) return null
  return (
    <div className="border rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3">Especificaciones</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="flex">
            <dt className="w-40 text-neutral-500 capitalize">{formatAttributeLabel(key)}</dt>
            <dd className="flex-1 font-medium">{formatAttributeValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
