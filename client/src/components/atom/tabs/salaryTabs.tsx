import { useContext } from "react";
import { profileTabItems } from "../../../constant/tabs";
import { context } from "../../../context/salaryContext";
import type { ProfileTabItem } from "../../../interfaces";

export default function SalaryTab() {
  const { setDisplayData, activeTab } = useContext(context);

  const onClick = (id: number) => {
    setDisplayData((prev) => ({
      ...prev,
      activeTab: profileTabItems.find((el) => el.id === id) as ProfileTabItem,
    }));
  };
  return (
    <>
      {profileTabItems
        .filter((item) => item.id !== 5)
        .map((item) => (
          <li
            key={item.id}
            className={`${item.id === activeTab.id ? "active" : ""}`}
          >
            <a
              data-toggle="tab"
              className="btn"
              onClick={() => {
                onClick(item.id);
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
    </>
  );
}
