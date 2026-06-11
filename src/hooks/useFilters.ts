import { useState, useMemo } from 'react'
import type { Cafe, FilterState } from '@/types'

const INITIAL: FilterState = {
  borough:   null,
  wifi:      null,
  outlets:   null,
  noise:     null,
  desk_size: null,
}

export function useFilters(allCafes: Cafe[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL)

  function toggleFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }))
  }

  const filteredCafes = useMemo(() => {
    return allCafes.filter(cafe => {
      if (filters.borough   && cafe.borough    !== filters.borough)   return false
      if (filters.wifi      && cafe.wifi       !== filters.wifi)      return false
      if (filters.outlets   && cafe.outlets    !== filters.outlets)   return false
      if (filters.noise     && cafe.noise      !== filters.noise)     return false
      if (filters.desk_size && cafe.desk_size  !== filters.desk_size) return false
      return true
    })
  }, [allCafes, filters])

  function resetFilters() {
    setFilters(INITIAL)
  }

  return { filters, filteredCafes, toggleFilter, resetFilters }
}
