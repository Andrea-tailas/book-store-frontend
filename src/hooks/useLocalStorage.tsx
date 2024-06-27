import { useEffect, useState } from "react";
import { Book } from "../alltypes";
function useLocalStorage(key: string, defaultValue: Book[]) {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      if (value != null) return JSON.parse(value);
    } catch (error: any) {
      console.log(error);
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(localStorageValue));
  }, [key, defaultValue]);

  return [localStorageValue, setLocalStorageValue];
}

export default useLocalStorage;
