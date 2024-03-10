import GenerateSalaryBtn from "../../mollecul/button/generateSalaryBtn";
import genSalaryPng from "../../../images/generate-salary-illustration.png";
import { useContext, type SyntheticEvent } from "react";
import { context } from "../../../context/salaryContext";
import DatePicker from "../../atom/form/datePicker";

export default function GenerateSalaryPage() {
  const { generatedDate, changeGeneratedDate } = useContext(context);
  const datePickerHandler = (
    date: Date | null,
    e: SyntheticEvent<any, Event>
  ) => {
    if (date) changeGeneratedDate(date)(e as any);
  };

  return (
    <div className="portlet portlet-boxed">
      <div className="portlet-header">
        <h4 className="portlet-title">Generate salary</h4>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-4">
            <GenerateSalaryBtn />
          </div>
          <div className="col-md-4">
            <form>

            </form>
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="date">Date</label>
                <DatePicker
                  value={generatedDate.toISOString()}
                  name="date"
                  onChangeHandler={datePickerHandler}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4 generate-salary-illustration_wrapper">
            <img
              src={genSalaryPng}
              alt="Generate Salaty Illustration"
              className="generate-salary-illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
