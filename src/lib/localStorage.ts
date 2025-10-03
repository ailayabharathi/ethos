"use client";

export const loadState = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return defaultValue;
  }
};

export const saveState = <T>(key: string, state: T) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};