import type { BaseDocument, LoanUnit } from ".";

export interface IBonus extends BaseDocument {
  amount: number;
  date: string;
  description: string;
  isRepeating: boolean;
  employeeId: string;
  unit: LoanUnit;
}

export interface BonusFormProps {
  date: string;
  amount: number;
  description: string;
  isRepeating: boolean;
  unit: LoanUnit;
}
