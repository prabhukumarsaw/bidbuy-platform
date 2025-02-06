import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuctionFilters } from '@/types/types';

interface FilterState extends AuctionFilters {
  activeFilters: string[];
  selectedPricePreset: string | null;
  filterPresets: Record<string, Partial<FilterState>>;
}

interface FilterStore {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  removeFilter: (filterLabel: string) => void;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (name: string) => void;
  deleteFilterPreset: (name: string) => void;
}

const initialState: FilterState = {
  search: '',
  categoryId: '',
  sellerId: '',
  // minPrice: undefined,
  // maxPrice: undefined,
  activeFilters: [],
  selectedPricePreset: null,
  filterPresets: {},
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: initialState,
      setFilter: (key, value) => {
        set((state) => {
          const newFilters = { ...state.filters, [key]: value };
          
          // Update active filters
          newFilters.activeFilters = Object.entries(newFilters)
            .filter(([k, v]) => v !== '' && v !== null && k !== 'activeFilters' && k !== 'selectedPricePreset' && k !== 'filterPresets')
            .map(([k, v]) => `${k}: ${v}`);

          return { filters: newFilters };
        });
      },
      clearFilters: () => set((state) => ({ 
        filters: { ...initialState, filterPresets: state.filters.filterPresets } 
      })),
      removeFilter: (filterLabel) => {
        const [key, _] = filterLabel.split(': ');
        set((state) => {
          const newFilters = { ...state.filters, [key]: initialState[key as keyof FilterState] };
          newFilters.activeFilters = newFilters.activeFilters.filter(f => f !== filterLabel);
          return { filters: newFilters };
        });
      },
      saveFilterPreset: (name) => {
        set((state) => {
          const { activeFilters, selectedPricePreset, filterPresets, ...filtersToSave } = state.filters;
          const newPresets = { 
            ...state.filters.filterPresets, 
            [name]: filtersToSave 
          };
          return { filters: { ...state.filters, filterPresets: newPresets } };
        });
      },
      loadFilterPreset: (name) => {
        set((state) => {
          const preset = state.filters.filterPresets[name];
          if (preset) {
            return { 
              filters: { 
                ...state.filters, 
                ...preset, 
                activeFilters: Object.entries(preset)
                  .filter(([k, v]) => v !== '' && v !== null)
                  .map(([k, v]) => `${k}: ${v}`)
              } 
            };
          }
          return state;
        });
      },
      deleteFilterPreset: (name) => {
        set((state) => {
          const newPresets = { ...state.filters.filterPresets };
          delete newPresets[name];
          return { filters: { ...state.filters, filterPresets: newPresets } };
        });
      },
    }),
    {
      name: 'filter-storage',
    }
  )
);
