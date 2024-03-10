import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { TabEmployeeContext } from "../interfaces/context";
import type { HistoryRaises, PaymentHistory } from "../interfaces/salary";
import { profileTabItems } from "../constant/tabs";

export type ContextValue = TabEmployeeContext & {
  setDisplayData: Dispatch<SetStateAction<TabEmployeeContext>>;
};

export const context = createContext<ContextValue>({} as ContextValue);

export interface TabContentWrapperProps {
  children: ReactNode;
}

export default function TabContentWrapper({
  children,
}: TabContentWrapperProps) {
  const [displayData, setDisplayData] = useState<TabEmployeeContext>({
    salary: {
      _id:'',
      amount: 0,
      employeeId: "",
      date: "",
      description: "",
      historyRaises: [] as HistoryRaises[],
      paymentHistory: [] as PaymentHistory[],
      createdAt: "",
      updatedAt: "",
    },
    loans: [],
    loanPayments: [],
    bonuses: [],
    penalties:[],
    activeTab:profileTabItems[0]
  });

  return (
    <context.Provider value={{ ...displayData, setDisplayData }}>
      {children}
    </context.Provider>
  );
}
