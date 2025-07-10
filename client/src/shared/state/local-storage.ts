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
  try {
    // Check if localStorage is available
    if (!window.localStorage) {
      console.warn("localStorage is not available");
      return false;
    }

    // Test localStorage accessibility
    const testKey = "__test__";
    try {
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
    } catch (error) {
      console.warn(
        "localStorage is not accessible (possibly in private/incognito mode):",
        error
      );
      return false;
    }

    // Proceed with setting the value
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

const resultsAtom = atom(getLocalStorage("resultsKey") || "default value");

resultsAtom.onMount = (setAtom) => {
  const callback = (newValue: string) => {
    setLocalStorage("resultsKey", newValue || "default value");
  };
  setAtom(callback);
};

export { resultsAtom };
