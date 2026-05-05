import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchManifest, searchIcons } from '../modules/deviconSearch.js';
import { useGridContext } from '../state/context.js';
import type { DeviconEntry } from '../types/devicon.js';
import type { IconEntry } from '../types/index.js';

const DEFAULT_CATEGORY_ID = 'default-category';
const DEFAULT_CATEGORY_NAME = 'Icons';

function buildSvgUrl(name: string, variant: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;
}

function toDisplayName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function IconPanel() {
  const { state, dispatch } = useGridContext();
  const [manifest, setManifest] = useState<DeviconEntry[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<DeviconEntry[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadManifest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchManifest();
      setManifest(data);
      setFilteredIcons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch icon manifest');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const results = searchIcons(query, manifest);
      setFilteredIcons(results);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, manifest]);

  // Keep selectedCategoryId in sync with available categories
  useEffect(() => {
    if (state.categories.length === 0) {
      setSelectedCategoryId(null);
    } else if (!selectedCategoryId || !state.categories.some(c => c.id === selectedCategoryId)) {
      setSelectedCategoryId(state.categories[0].id);
    }
  }, [state.categories, selectedCategoryId]);

  const handleIconClick = useCallback(
    (entry: DeviconEntry) => {
      const variant = entry.versions.svg[0] ?? 'original';
      const icon: IconEntry = {
        id: uuidv4(),
        name: entry.name,
        displayName: toDisplayName(entry.name),
        svgUrl: buildSvgUrl(entry.name, variant),
        variant,
      };

      let categoryId: string;
      if (selectedCategoryId && state.categories.some(c => c.id === selectedCategoryId)) {
        categoryId = selectedCategoryId;
      } else if (state.categories.length > 0) {
        categoryId = state.categories[0].id;
      } else {
        categoryId = DEFAULT_CATEGORY_ID;
        dispatch({
          type: 'CREATE_CATEGORY',
          payload: { id: DEFAULT_CATEGORY_ID, name: DEFAULT_CATEGORY_NAME },
        });
        setSelectedCategoryId(DEFAULT_CATEGORY_ID);
      }

      dispatch({ type: 'ADD_ICON', payload: { icon, categoryId } });
    },
    [state.categories, selectedCategoryId, dispatch],
  );

  if (loading) {
    return (
      <div className="icon-panel" role="status" aria-label="Loading icons">
        <p>Loading icons…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="icon-panel" role="alert">
        <p>Error: {error}</p>
        <button type="button" onClick={loadManifest}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="icon-panel">
      <label htmlFor="icon-search" className="icon-panel__label">
        Search Icons
      </label>
      <input
        id="icon-search"
        type="search"
        placeholder="Search icons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="icon-panel__search"
        aria-label="Search icons"
      />

      {/* Category selector */}
      {state.categories.length > 0 && (
        <div className="icon-panel__category-select">
          <label htmlFor="target-category" className="icon-panel__label">
            Add to Category
          </label>
          <select
            id="target-category"
            value={selectedCategoryId ?? ''}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="icon-panel__search"
            aria-label="Select target category"
          >
            {state.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="icon-panel__grid" role="list" aria-label="Icon results">
        {filteredIcons.map((entry) => {
          const variant = entry.versions.svg[0] ?? 'original';
          const svgUrl = buildSvgUrl(entry.name, variant);
          return (
            <button
              key={`${entry.name}-${variant}`}
              type="button"
              className="icon-panel__item"
              onClick={() => handleIconClick(entry)}
              aria-label={`Add ${toDisplayName(entry.name)} icon`}
              role="listitem"
            >
              <img
                src={svgUrl}
                alt={entry.name}
                className="icon-panel__thumbnail"
                width={40}
                height={40}
                loading="lazy"
              />
              <span className="icon-panel__name">{toDisplayName(entry.name)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
