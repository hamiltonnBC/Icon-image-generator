import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GridState } from '../types/index.js';
import type { GridAction } from './actions.js';
import { gridReducer } from './reducer.js';

const defaultSettings = {
  iconSize: 64,
  labelEnabled: true,
  labelPosition: 'below' as const,
  labelFontSize: 12,
  categoryHeaderEnabled: true,
  background: 'white' as const,
  padding: 16,
  categorySpacing: 32,
};

const initialState: GridState = {
  categories: [],
  icons: {},
  settings: defaultSettings,
};

interface GridContextValue {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
}

const GridContext = createContext<GridContextValue | null>(null);

interface GridProviderProps {
  children: ReactNode;
  initialState?: GridState;
}

export function GridProvider({ children, initialState: providedState }: GridProviderProps) {
  const [state, dispatch] = useReducer(gridReducer, providedState ?? initialState);

  return (
    <GridContext value={{ state, dispatch }}>
      {children}
    </GridContext>
  );
}

export function useGridContext(): GridContextValue {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  return context;
}

export { GridContext };
