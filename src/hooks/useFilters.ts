import { useState, useMemo } from 'react'
import type { Cafe, FilterState } from '@/types'

const INITIAL: FilterState = {
  borough:   [],
  wifi:      [],
  outlets:   [],
  noise:     [],
  desk_size: [],
  seats:     [],
}

export function useFilters(allCafes: Cafe[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL)

  const filteredCafes = useMemo(() => {
    return allCafes.filter(cafe => {
      if (filters.borough.length   && !filters.borough.includes(cafe.borough))     return false
      if (filters.wifi.length      && !filters.wifi.includes(cafe.wifi))            return false
      if (filters.outlets.length   && !filters.outlets.includes(cafe.outlets))      return false
      if (filters.desk_size.length && !filters.desk_size.includes(cafe.desk_size))  return false
      if (filters.seats.length     && (!cafe.seats || !filters.seats.includes(cafe.seats))) return false
      if (filters.noise.length     && (!cafe.noise || !filters.noise.includes(cafe.noise))) return false
      return true
    })
  }, [allCafes, filters])

  function resetFilters() {
    setFilters(INITIAL)
  }

  return { filters, setFilters, filteredCafes, resetFilters }
}
