import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface OptionContextType {
  isProjectColorChangeEnabled: boolean;
  setIsProjectColorChangeEnabled: (value: boolean) => void;
}

const OptionContext = createContext<OptionContextType | undefined>(undefined);

export const OptionProvider = ({ children }: { children: ReactNode }) => {
  const [isProjectColorChangeEnabled, setIsProjectColorChangeEnabled] =
    useState(false);

  return (
    <OptionContext.Provider
      value={{ isProjectColorChangeEnabled, setIsProjectColorChangeEnabled }}
    >
      {children}
    </OptionContext.Provider>
  );
};

export const useOptionContext = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("에러: OptionProvider를 찾을 수 없습니다.");
  }
  return context;
};
