"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface PlaygroundRevealValue {
  revealed: boolean;
  toggle: () => void;
}

const PlaygroundRevealContext = createContext<PlaygroundRevealValue | null>(null);

export function PlaygroundRevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  const value = useMemo(
    () => ({
      revealed,
      toggle: () => setRevealed((current) => !current),
    }),
    [revealed]
  );

  return (
    <PlaygroundRevealContext.Provider value={value}>
      {children}
    </PlaygroundRevealContext.Provider>
  );
}

export function usePlaygroundReveal() {
  const context = useContext(PlaygroundRevealContext);

  if (!context) {
    return {
      revealed: false,
      toggle: () => {},
    };
  }

  return context;
}
