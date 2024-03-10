import type { ReactNode } from "react";

export interface PercentageInfoProps {
  children: ReactNode;
  title: string;
}

export default function PercentageInfo({
  children,
  title,
}: PercentageInfoProps) {
  return (
    <div className="portlet portlet-boxed">
      <div className="portlet-header">
        <h4 className="portlet-title">{title}</h4>
      </div>
      <div
        className="portlet-body"
        style={{
          textAlign: "center",
          fontWeight: "400",
          letterSpacing: "2px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
