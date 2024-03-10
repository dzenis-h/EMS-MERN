import { ChevronRight, Info } from "react-feather";
import { profileTabItems } from "../../../constant/tabs";
import { useContext } from "react";
import { context } from "../../../context/tabContent";
import type { ProfileTabItem } from "../../../interfaces";

export default function EmployeeTabs() {
  const { setDisplayData } = useContext(context);

  const onClick = (id: number) => {
    setDisplayData((prev) => ({
      ...prev,
      activeTab: profileTabItems.find((el) => el.id === id) as ProfileTabItem,
    }));
  };
  return (
    <>
      {profileTabItems.map((item) => (
        <a
          className={`list-group-item ${item.active ? "selectedTab" : ""}`}
          key={item.id}
          onClick={() => {
            onClick(item.id);
          }}
        >
          <Info size="18" /> &nbsp;&nbsp;
          {item.name}
          <ChevronRight size="18" />
        </a>
      ))}
    </>
  );
}
