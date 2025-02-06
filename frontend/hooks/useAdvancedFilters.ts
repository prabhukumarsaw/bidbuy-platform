// @ts-nocheck

import { useFilterStore } from "@/lib/store/filterStore"
import { useAuctions, useCategories, useSellers } from "@/hooks/useBackground"
import { useEffect, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export const useAdvancedFilters = (initialPage = 1, initialLimit = 10) => {
  const { filters, setFilter, clearFilters, removeFilter, saveFilterPreset, loadFilterPreset, deleteFilterPreset } =
    useFilterStore()

  const debouncedFilters = useDebounce(filters, 300)

  const { data: auctionsResponse, isLoading: isAuctionsLoading } = useAuctions({
    ...debouncedFilters,
    page: initialPage,
    limit: initialLimit,
  })

  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const { data: sellers, isLoading: isSellersLoading } = useSellers()

  const sortedCategories = useMemo(() => {
    return categories?.categories?.sort((a, b) => a.name.localeCompare(b.name)) || []
  }, [categories])

  const sortedSellers = useMemo(() => {
    return sellers?.sort((a, b) => a.businessName.localeCompare(b.businessName)) || []
  }, [sellers])

  return {
    filters: debouncedFilters,
    setFilter,
    clearFilters,
    removeFilter,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset,
    auctionsResponse,
    categories: sortedCategories,
    sellers: sortedSellers,
    isLoading: isAuctionsLoading || isCategoriesLoading || isSellersLoading,
  }
}

