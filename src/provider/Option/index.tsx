import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface OptionContextType {
  isOptionThreeEnabled: boolean;
  setIsOptionThreeEnabled: (value: boolean) => void;
  isProjectColorChangeEnabled: boolean;
  setIsProjectColorChangeEnabled: (value: boolean) => void;
  isTaskColorChangeEnabled: boolean;
  setIsTaskColorChangeEnabled: (value: boolean) => void;
}

const OptionContext = createContext<OptionContextType | undefined>(undefined);

export const OptionProvider = ({ children }: { children: ReactNode }) => {
  const [isOptionThreeEnabled, setIsOptionThreeEnabled] = useState(false);
  const [isProjectColorChangeEnabled, setIsProjectColorChangeEnabled] =
    useState(false);
  const [isTaskColorChangeEnabled, setIsTaskColorChangeEnabled] =
    useState(false);
  return (
    <OptionContext.Provider
      value={{
        isOptionThreeEnabled,
        setIsOptionThreeEnabled,
        isProjectColorChangeEnabled,
        setIsProjectColorChangeEnabled,
        isTaskColorChangeEnabled,
        setIsTaskColorChangeEnabled,
      }}
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
