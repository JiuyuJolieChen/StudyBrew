'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Cafe, FilterState } from '@/types'
import { useFilters } from '@/hooks/useFilters'
import MapContainer from '@/components/map/MapContainer'
import FilterBar from '@/components/filters/FilterBar'
import CafeCard from '@/components/cafe/CafeCard'
import Button from '@/components/ui/Button'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import styles from './HomeClient.module.css'

interface HomeClientProps {
  initialCafes: Cafe[]
}

export default function HomeClient({ initialCafes }: HomeClientProps) {
  const { filters, setFilters, filteredCafes, resetFilters } = useFilters(initialCafes)
  const [mobileView, setMobileView]       = useState<'map' | 'list'>('map')
  const [listCollapsed, setListCollapsed] = useState(false)

  function handleFilterChange(next: FilterState) {
    setFilters(next)
  }

  function handleCafeClick(_cafe: Cafe) {
    setMobileView('map')
  }

  const cafeCount = filteredCafes.length
  const listPanelClass = [
    styles.listPanel,
    listCollapsed ? styles.collapsed : '',
    mobileView === 'list' ? styles.mobileListVisible : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <WatercolorSurface seed={1} />
        <Link href="/" className={styles.logo}>
          StudyBrew
          <img src="/icons/coffee_cup_transparent.png" alt="" className={styles.logoIcon} />
        </Link>
        <Link href="/add" className={styles.headerCta}>
          <Button variant="accent" size="sm">
            Add a café
          </Button>
        </Link>
      </header>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <WatercolorSurface seed={2} />
        <div className={styles.filterBarContent}>
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Main content */}
      <div className={styles.main}>
        {/* List panel */}
        <aside className={listPanelClass}>
          <WatercolorSurface seed={1} />
          <div className={styles.listCount}>
            {cafeCount} café{cafeCount !== 1 ? 's' : ''}
          </div>
          <div className={styles.listScroll}>
            {filteredCafes.length === 0 ? (
              <div className={styles.emptyState}>
                <span>No cafés match these filters</span>
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  onClick={() => handleCafeClick(cafe)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Map panel */}
        <div className={styles.mapPanel}>
          <MapContainer
            cafes={filteredCafes}
          />
          <button
            className={styles.drawerToggle}
            onClick={() => setListCollapsed(c => !c)}
            aria-label={listCollapsed ? 'Show list' : 'Hide list'}
          >
            {listCollapsed ? '›' : '‹'}
          </button>
        </div>
      </div>

      {/* Mobile toggle */}
      <div className={styles.mobileToggle}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setMobileView(mobileView === 'map' ? 'list' : 'map')}
        >
          {mobileView === 'map' ? `List (${cafeCount})` : 'Map'}
        </Button>
      </div>
    </div>
  )
}
