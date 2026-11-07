import React from 'react';

type EntityType = 'anime' | 'manga' | 'character' | 'person' | 'studio';

export interface HistoryItem {
  id: string | number;
  type: EntityType;
  title: string;
  image: string;
  timestamp: number;
}

const HISTORY_KEY = 'anivibe_visit_history';
const MAX_HISTORY = 12;

export function useHistory() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = React.useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
    setHistory(prev => {
      const filtered = prev.filter(h => !(h.id === item.id && h.type === item.type));
      const newState = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  return { history, addToHistory };
}
