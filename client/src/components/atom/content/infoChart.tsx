export interface InfoChartProps {
  color: string;
  keyInfo: string;
  info: string;
}

export default function InfoChart({ color, keyInfo, info }: InfoChartProps) {
  return (
    <p>
      {" "}
      <span
        style={{
          fontFamily: "Arial",
          color,
          fontWeight: "bold",
          letterSpacing: "2px",
        }}
      >
        {keyInfo}
      </span>{" "}
      <i className={`fa fa-long-arrow-right`} />
      {info}
    </p>
  );
}
