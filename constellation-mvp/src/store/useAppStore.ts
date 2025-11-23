// Zustand store for global application state
import { create } from 'zustand';
import { GraphNode, UserStats } from '@/lib/mockData';
import { mockNodes, mockUserStats } from '@/lib/mockData';

export type AppMode = 'dashboard' | 'graph' | 'workspace';

interface AppState {
  // Current view mode
  currentMode: AppMode;
  setCurrentMode: (mode: AppMode) => void;
  
  // Selected node in the graph
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
  
  // User statistics
  userStats: UserStats;
  updateUserStats: (stats: Partial<UserStats>) => void;
  
  // Graph nodes
  nodes: GraphNode[];
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  
  // Initialize with mock data
  initialize: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentMode: 'dashboard',
  selectedNode: null,
  userStats: mockUserStats,
  nodes: [],
  
  // Actions
  setCurrentMode: (mode) => set({ currentMode: mode }),
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  updateUserStats: (updates) =>
    set((state) => ({
      userStats: { ...state.userStats, ...updates },
    })),
  
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),
  
  initialize: () =>
    set({
      nodes: mockNodes,
      userStats: mockUserStats,
    }),
}));

