import { atom } from "jotai";

export const getLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue !== null ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(
      `Error parsing JSON from localStorage for key "${key}":`,
      error
    );
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const resultsAtom = atom(getLocalStorage("resultsKey") || "default value");

resultsAtom.onMount = (setAtom) => {
  const callback = (newValue: string) => {
    setLocalStorage("resultsKey", newValue || "default value");
  };
  setAtom(callback);
};

export { resultsAtom };
