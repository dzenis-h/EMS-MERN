import { deleteBonus } from "../actions/bonus";
import { deletePenalty } from "../actions/penalty";
import { months } from "../constant/month";
import type { ContextValue } from "../context/tabContent";
import type {
  DeleteItemFunc,
  DisplayContent,
  DisplaySalaryTab,
} from "../interfaces";
import type { EmployeeSalaryDetail } from "../interfaces/employee";

export const getActiveEmployeeTabContent = (
  activeTab: string,
  { penalties, loanPayments, loans, salary, bonuses }: ContextValue
): DisplayContent[] => {
  switch (activeTab) {
    case "Bonuses":
      return bonuses.map(mapData);
    case "Penalties":
      return penalties.map(mapData);
    case "Loans":
      return loans.map((el) => ({
        date: el.date,
        amount: el.amount,
        description: el.description,
        unit: el.unit,
        _id: el._id,
      }));
    case "Loan Extra Payments":
      return loanPayments.map((el) => ({
        date: el.date,
        amount: el.amount,
        description: el.description,
        unit: el.unit,
        _id: el._id,
      }));
    case "Salary Raises":
    default:
      return salary.historyRaises.map((el) => ({
        date: el.date,
        amount: el.amount,
        description: el.description,
        unit: el.unit,
        _id: (el as any)._id,
      }));
  }
};

export const getActiveEmployeeTabFunc = (
  activeTab: string
): DeleteItemFunc | null => {
  switch (activeTab) {
    case "Bonuses":
      return deleteBonus;
    case "Penalties":
      return deletePenalty;
    default:
      return null;
  }
};

export const mapData = (el: DisplayContent) => ({
  date: el.date,
  amount: el.amount,
  description: el.description,
  unit: el.unit,
  _id: el._id,
});

export const getActiveSalaryTabContent = (
  activeTab: string,
  datas: EmployeeSalaryDetail[],
  generatedDate?: Date
): DisplaySalaryTab[] => {
  const results: DisplaySalaryTab[] = [];
  for (const data of datas) {
    switch (activeTab) {
      case "Bonuses": {
        for (const { date, description, amount } of data.bonuses) {
          const dateDisplay = new Date(date ?? generatedDate);
          results.push({
            date: `${dateDisplay.getDate()}-${
              months[dateDisplay.getMonth()].label
            }-${dateDisplay.getFullYear()}`,
            description,
            amount,
            surname: data.surname,
          });
        }

        break;
      }
      case "Penalties": {
        for (const { date, description, amount } of data.penalties) {
          const dateDisplay = new Date(date ?? generatedDate);
          results.push({
            date: `${dateDisplay.getDate()}-${
              months[dateDisplay.getMonth()].label
            }-${dateDisplay.getFullYear()}`,
            description,
            amount,
            surname: data.surname,
          });
        }
        break;
      }
      case "Loans": {
        const now = generatedDate ?? new Date();
        if (data.loanDetail)
          results.push({
            surname: data.surname,
            amount: data.loanDetail.installment,
            description: data.loanDetail.note,
            date: `${now.getDate()}-${
              months[now.getMonth()].label
            }-${now.getFullYear()}`,
          });
        break;
      }
      case "Salary Raises": {
        const now = generatedDate ?? new Date();
        results.push({
          surname: data.surname,
          amount: data.takeHomePay,
          date: `${now.getDate()}-${
            months[now.getMonth()].label
          }-${now.getFullYear()}`,
          description: "total net salary",
        });
        break;
      }
      default:
        break;
    }
  }
  return results;
};

export const getRandomColor = () => {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
