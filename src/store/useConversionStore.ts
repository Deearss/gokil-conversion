import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConversionRecord {
  id: string;
  originalName: string;
  originalSize: number;
  timestamp: number;
  status: "success" | "failed";
}

interface ConversionState {
  history: ConversionRecord[];
  addRecord: (record: ConversionRecord) => void;
  clearHistory: () => void;
}

export const useConversionStore = create<ConversionState>()(
  persist(
    (set) => ({
      history: [],
      addRecord: (record) =>
        set((state) => ({ history: [record, ...state.history] })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "gokil-conversion-metadata",
    }
  )
);
