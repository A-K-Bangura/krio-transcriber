import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number; // in ms
  speaker?: string;
  notes?: string;
}

interface TranscriptionState {
  segments: TranscriptSegment[];
  currentText: string;
  isRecording: boolean;
  audioFile: File | null;
  playbackTime: number;
  darkMode: boolean;
  
  // Actions
  addSegment: (text: string, speaker?: string) => void;
  updateSegment: (id: string, updates: Partial<TranscriptSegment>) => void;
  deleteSegment: (id: string) => void;
  setCurrentText: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAudioFile: (file: File | null) => void;
  setPlaybackTime: (time: number) => void;
  toggleDarkMode: () => void;
  insertTimestamp: () => void;
  clearAll: () => void;
}

export const useTranscriptionStore = create<TranscriptionState>((set, get) => ({
  segments: [],
  currentText: '',
  isRecording: false,
  audioFile: null,
  playbackTime: 0,
  darkMode: false,

  addSegment: (text: string, speaker?: string) => {
    const segment: TranscriptSegment = {
      id: uuidv4(),
      text,
      timestamp: get().playbackTime,
      speaker,
    };
    set((state) => ({
      segments: [...state.segments, segment],
      currentText: '',
    }));
  },

  updateSegment: (id: string, updates: Partial<TranscriptSegment>) => {
    set((state) => ({
      segments: state.segments.map((seg) =>
        seg.id === id ? { ...seg, ...updates } : seg
      ),
    }));
  },

  deleteSegment: (id: string) => {
    set((state) => ({
      segments: state.segments.filter((seg) => seg.id !== id),
    }));
  },

  setCurrentText: (text: string) => set({ currentText: text }),
  
  setIsRecording: (isRecording: boolean) => set({ isRecording }),
  
  setAudioFile: (file: File | null) => set({ audioFile: file }),
  
  setPlaybackTime: (time: number) => set({ playbackTime: time }),
  
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newDarkMode };
    });
  },

  insertTimestamp: () => {
    const { playbackTime, currentText } = get();
    const timestamp = formatTimestamp(playbackTime);
    set({ currentText: currentText + ` [${timestamp}] ` });
  },

  clearAll: () => set({ segments: [], currentText: '', playbackTime: 0 }),
}));

export const formatTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
