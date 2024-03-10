import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  type MouseEventHandler,
} from "react";
import type { TabSalaryContext } from "../interfaces/context";
import { profileTabItems } from "../constant/tabs";

export type ContextValue = TabSalaryContext & {
  setDisplayData: Dispatch<SetStateAction<TabSalaryContext>>;
  changeGeneratedDate: (d: Date) => MouseEventHandler;
};

export const context = createContext<ContextValue>({} as ContextValue);

export interface SalaryWrapperProps {
  children: ReactNode;
}

export default function SalaryWrapper({ children }: SalaryWrapperProps) {
  const [displayData, setDisplayData] = useState<TabSalaryContext>({
    activeTab: profileTabItems[0],
    datas: [],
    step: "Generate",
    generatedDate: new Date(),
    isRepeated:false
  });

  const changeGeneratedDate =
    (date: Date): MouseEventHandler =>
    (e) => {
      setDisplayData((prev) => ({
        ...prev,
        generatedDate: date,
      }));
    };

  return (
    <context.Provider
      value={{ ...displayData, setDisplayData, changeGeneratedDate }}>
      {children}
    </context.Provider>
  );
}
