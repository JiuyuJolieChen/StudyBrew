'use client'
import { useRef, useEffect } from 'react'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import Spinner from '@/components/ui/Spinner'
import type { GeoResult } from '@/types'
import styles from './CafeForm.module.css'

interface Props {
  onSelect: (result: GeoResult) => void
  defaultValue?: string
}

export default function AddressSearch({ onSelect, defaultValue }: Props) {
  const { query, setQuery, results, setResults, isLoading } = useAddressSearch()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Initialize query from defaultValue only once
  useEffect(() => {
    if (defaultValue) setQuery(defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setResults])

  function handleSelect(result: GeoResult) {
    setQuery(result.display_name.slice(0, 60))
    setResults([])
    onSelect(result)
  }

  const showDropdown = results.length > 0

  return (
    <div className={styles.addressWrapper} ref={wrapperRef}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for address…"
          autoComplete="off"
          style={{
            width: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: showDropdown ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            paddingRight: isLoading ? 'var(--space-8)' : 'var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            outline: 'none',
          }}
        />
        {isLoading && (
          <span style={{ position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)' }}>
            <Spinner size={16} />
          </span>
        )}
      </div>

      {showDropdown && (
        <ul className={styles.dropdown}>
          {results.slice(0, 5).map((result, i) => (
            <li
              key={i}
              className={styles.dropdownItem}
              onMouseDown={e => { e.preventDefault(); handleSelect(result) }}
            >
              {result.display_name.slice(0, 60)}{result.display_name.length > 60 ? '…' : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
