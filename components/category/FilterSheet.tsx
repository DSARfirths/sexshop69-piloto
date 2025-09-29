'use client'

import { Fragment, useEffect, useRef, type ReactElement } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { CategoryFilterState } from './filters-context'
import type { Filter } from '@/lib/products'
import type { TagType } from '@/lib/tagging'

type CategoryFilterOptions = {
  brands: string[]
  materials: string[]
  longitudes: string[]
  diametros: string[]
}

type FacetOptions = Partial<Record<TagType, readonly string[]>>

type FilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: CategoryFilterState
  options: CategoryFilterOptions
  onToggleBrand: (brand: string) => void
  onToggleMaterial: (material: string) => void
  onSelectLongitud: (value: string | null) => void
  onSelectDiametro: (value: string | null) => void
  onReset: () => void
  facetOptions?: FacetOptions
  selectedFacets?: Filter
  onToggleFacet?: (type: TagType, value: string) => void
}

const sectionClass = 'space-y-2'
const sectionTitleClass = 'text-sm font-semibold text-neutral-800'
const toggleListClass = 'flex flex-wrap gap-2'
const toggleClassBase =
  'rounded-full border px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
const toggleActiveClass = 'border-brand-primary bg-brand-primary text-white shadow-sm'
const toggleInactiveClass = 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-primary/60'

const FACET_LABELS: Record<TagType, string> = {
  persona: 'Colección',
  uso: 'Uso',
  feature: 'Feature',
  material: 'Material'
}

const FACET_ORDER: readonly TagType[] = ['persona', 'uso', 'feature', 'material']

function FacetCheckboxGroup({
  type,
  label,
  values,
  selected,
  onToggle
}: {
  type: TagType
  label: string
  values: readonly string[]
  selected: readonly string[]
  onToggle: (value: string) => void
}) {
  if (!values.length) return null

  return (
    <div className={sectionClass}>
      <p className={sectionTitleClass}>{label}</p>
      <div className="space-y-2">
        {values.map((value, index) => {
          const inputIdBase = `${type}-${value}`.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
          const safeId = `${inputIdBase}-${index}`
          const isChecked = selected.includes(value)
          return (
            <label
              key={value}
              htmlFor={safeId}
              className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-sm text-neutral-700 transition hover:border-brand-primary/40 hover:bg-brand-primary/5"
            >
              <input
                id={safeId}
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
                checked={isChecked}
                onChange={() => onToggle(value)}
              />
              <span>{value}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function ToggleGroup({
  label,
  values,
  isActive,
  onToggle
}: {
  label: string
  values: string[]
  isActive: (value: string) => boolean
  onToggle: (value: string) => void
}) {
  if (!values.length) return null

  return (
    <div className={sectionClass}>
      <p className={sectionTitleClass}>{label}</p>
      <div className={toggleListClass}>
        {values.map((value) => {
          const active = isActive(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={`${toggleClassBase} ${active ? toggleActiveClass : toggleInactiveClass}`}
              aria-pressed={active}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SelectFilter({
  label,
  placeholder,
  value,
  options,
  onChange
}: {
  label: string
  placeholder: string
  value: string | null
  options: string[]
  onChange: (value: string | null) => void
}) {
  if (!options.length) return null

  return (
    <div className={sectionClass}>
      <label className={sectionTitleClass}>
        {label}
        <select
          className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          value={value ?? ''}
          onChange={(event) => {
            const selected = event.target.value
            onChange(selected ? selected : null)
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function FilterContent({
  filters,
  options,
  onToggleBrand,
  onToggleMaterial,
  onSelectLongitud,
  onSelectDiametro,
  onReset,
  facetOptions,
  selectedFacets,
  onToggleFacet
}: Omit<FilterSheetProps, 'open' | 'onOpenChange'>) {
  const facetSections: ReactElement[] = []
  if (facetOptions && selectedFacets && onToggleFacet) {
    FACET_ORDER.forEach((type) => {
      const facetValues = facetOptions[type] ?? []
      if (!facetValues.length) return
      facetSections.push(
        <FacetCheckboxGroup
          key={type}
          type={type}
          label={FACET_LABELS[type]}
          values={facetValues}
          selected={selectedFacets[type] ?? []}
          onToggle={(value) => onToggleFacet(type, value)}
        />
      )
    })
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-brand-primary hover:underline"
        >
          Limpiar
        </button>
      </div>
      <div className="space-y-6">
        {facetSections.length > 0 ? <div className="space-y-6">{facetSections}</div> : null}
        <ToggleGroup
          label="Marca"
          values={options.brands}
          isActive={(value) => filters.brands.includes(value)}
          onToggle={onToggleBrand}
        />
        <ToggleGroup
          label="Material"
          values={options.materials}
          isActive={(value) => filters.materials.includes(value)}
          onToggle={onToggleMaterial}
        />
        <SelectFilter
          label="Longitud"
          placeholder="Selecciona una longitud"
          value={filters.longitud}
          options={options.longitudes}
          onChange={onSelectLongitud}
        />
        <SelectFilter
          label="Diámetro"
          placeholder="Selecciona un diámetro"
          value={filters.diametro}
          options={options.diametros}
          onChange={onSelectDiametro}
        />
      </div>
    </div>
  )
}

export default function FilterSheet({
  open,
  onOpenChange,
  filters,
  options,
  onToggleBrand,
  onToggleMaterial,
  onSelectLongitud,
  onSelectDiametro,
  onReset,
  facetOptions,
  selectedFacets,
  onToggleFacet
}: FilterSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (panel.contains(event.target as Node)) return
      onOpenChange(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <>
      <div className="pointer-events-none absolute right-0 top-full z-50 mt-3 hidden w-[min(90vw,360px)] md:block">
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div
            ref={panelRef}
            className="pointer-events-auto max-h-[75vh] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
          >
            <FilterContent
              filters={filters}
              options={options}
              onToggleBrand={onToggleBrand}
              onToggleMaterial={onToggleMaterial}
              onSelectLongitud={onSelectLongitud}
              onSelectDiametro={onSelectDiametro}
              onReset={onReset}
              facetOptions={facetOptions}
              selectedFacets={selectedFacets}
              onToggleFacet={onToggleFacet}
            />
          </div>
        </Transition>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={onOpenChange}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="relative flex h-[80vh] w-full max-w-md flex-col rounded-t-3xl border border-neutral-200 bg-white shadow-xl">
                <FilterContent
                  filters={filters}
                  options={options}
                  onToggleBrand={onToggleBrand}
                  onToggleMaterial={onToggleMaterial}
                  onSelectLongitud={onSelectLongitud}
                  onSelectDiametro={onSelectDiametro}
                  onReset={onReset}
                  facetOptions={facetOptions}
                  selectedFacets={selectedFacets}
                  onToggleFacet={onToggleFacet}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
