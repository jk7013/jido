import { create } from 'zustand';

export interface Run {
  id: string;
  mode: 'single' | 'ab';
  prompt_version: string;
  model: string;
  params_hash: string;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
  cost_usd: number;
  utc_ts: string;
  error_code?: string;
  trace_id: string;
}

interface RunsState {
  runs: Run[];
  selectedRunId: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  
  // Actions
  setRuns: (runs: Run[]) => void;
  setSelectedRun: (runId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  filteredRuns: Run[];
  selectedRun: Run | null;
}

export const useRunsStore = create<RunsState>((set, get) => ({
  runs: [],
  selectedRunId: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,

  setRuns: (runs) => set({ runs }),
  setSelectedRun: (runId) => set({ selectedRunId: runId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setLoading: (loading) => set({ isLoading: loading }),

  get filteredRuns() {
    const { runs, searchQuery } = get();
    if (!searchQuery) return runs;
    
    return runs.filter(run => 
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.prompt_version.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  get selectedRun() {
    const { runs, selectedRunId } = get();
    return runs.find(run => run.id === selectedRunId) || null;
  },
}));
