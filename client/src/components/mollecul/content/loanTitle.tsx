export interface LoanTitleProps {
  dataLength: number;
}

export default function LoanTitle({ dataLength }: LoanTitleProps) {
  return (
    <div className="portlet-header">
      <h4>
        Currently active loans <i className={`fa fa-long-arrow-right`} />
        <span
          style={{
            fontFamily: "Arial",
            color: "#3291b6",
            fontWeight: "bold",
            letterSpacing: "3px",
            fontSize: "30px",
          }}
        >
          {" "}
          {dataLength}{" "}
        </span>
      </h4>
      <p style={{ color: "#48C6EF" }}>
        Loans stats, monthly instalments, and notes <br />
      </p>
    </div>
  );
}
