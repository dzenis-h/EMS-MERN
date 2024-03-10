import BonusForm from "./bonusForm";
import LoanForm from "./loanForm";
import LoanPaymentForm from "./loanPayment";
import PenaltyForm from "./penaltyForm";
import SalaryRaise from "./salaryRaiseForm";

export interface GetEmployeeFormProps {
  tabId: number;
}

export default function GetEmployeeForm({ tabId }: GetEmployeeFormProps) {
  switch (tabId) {
    case 1:
      return <SalaryRaise />;
    case 2:
      return <BonusForm />;
    case 3:
      return <PenaltyForm />;
    case 4:
      return <LoanForm />;
    case 5:
      return <LoanPaymentForm />;
    default:
      return <SalaryRaise />;
  }
}
