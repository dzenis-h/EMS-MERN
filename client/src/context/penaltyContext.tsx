import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { CreatePenaltyProps } from "../interfaces/penalty";

export type ContextValue = {
  setPenaltyForms: Dispatch<
    SetStateAction<(CreatePenaltyProps & { employeeId: string })[]>
  >;
  penaltyForms: (CreatePenaltyProps & { employeeId: string })[];
};

export const context = createContext<ContextValue>({} as ContextValue);

export interface PenaltyWrapperProps {
  children: ReactNode;
}

export default function PenaltyWrapper({ children }: PenaltyWrapperProps) {
  const [penaltyForms, setPenaltyForms] = useState<
    (CreatePenaltyProps & { employeeId: string })[]
  >([]);

  return (
    <context.Provider value={{ penaltyForms, setPenaltyForms }}>
      {children}
    </context.Provider>
  );
}
