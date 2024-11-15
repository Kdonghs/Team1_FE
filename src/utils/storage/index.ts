interface StorageKey {
  authToken?: { role: string; token: string };
}

const initStorage = <T extends keyof StorageKey>(key: T, storage: Storage) => {
  const storageKey = `${key}`;

  const get = (): StorageKey[T] | undefined => {
    const value = storage.getItem(storageKey);

    if (value) {
      return JSON.parse(value as string);
    }

    return undefined;
  };

  const set = (value: StorageKey[T] | undefined) => {
    if (value == undefined || value == null) {
      return storage.removeItem(storageKey);
    }

    const stringifiedValue = JSON.stringify(value);

    storage.setItem(storageKey, stringifiedValue);
  };

  return { get, set };
};

export const authSessionStorage = initStorage("authToken", sessionStorage);
