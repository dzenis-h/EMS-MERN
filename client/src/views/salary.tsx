import { ToastContainer } from "react-toastify";
import SalaryTabs from "../components/organ/tabs/salaryTab";
import type { SalaryStep } from "../interfaces/context";
import { type MouseEventHandler, useContext } from "react";
import { context } from "../context/salaryContext";
import PreviewSalaryPage from "../components/organ/content/previewSalaryPage";
import GenerateSalaryPage from "../components/organ/content/generateSalaryPage";

function ChangePage(step: SalaryStep, nextStep: MouseEventHandler, date: Date) {
  switch (step) {
    case "Generate":
      return <GenerateSalaryPage />;
    case "Preview":
      return <PreviewSalaryPage handler={nextStep} date={date} />;
    case "Release":
      return <SalaryTabs />;
  }
}

export default function SalaryPage() {
  const { step, setDisplayData, generatedDate } = useContext(context);

  const nextStep: MouseEventHandler = (e) => {
    e.preventDefault();

    setDisplayData((prev) => ({
      ...prev,
      step: "Release",
    }));
  };

  return (
    <>
      <div className="container">
        {ChangePage(step, nextStep, generatedDate)}
      </div>
      <ToastContainer autoClose={3000} closeOnClick />
    </>
  );
}
