'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type CategoryFilterState = {
  query: string
  brands: string[]
  materials: string[]
  longitud: string | null
  diametro: string | null
}

export type CategoryFiltersContextValue = {
  filters: CategoryFilterState
  isBrandSelected: (brand?: string | null) => boolean
  isMaterialSelected: (material?: string | null) => boolean
}

const CategoryFiltersContext = createContext<CategoryFiltersContextValue | null>(null)

export function CategoryFiltersProvider({
  value,
  children
}: {
  value: CategoryFiltersContextValue
  children: ReactNode
}) {
  return <CategoryFiltersContext.Provider value={value}>{children}</CategoryFiltersContext.Provider>
}

export function useCategoryFilters() {
  return useContext(CategoryFiltersContext)
}
