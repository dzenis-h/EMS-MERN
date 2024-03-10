import ReactLoading from "react-loading";

export default function BarLoader() {
  return (
    <div className="flexCenter">
      <ReactLoading type="bars" color="#48c6ef" />
    </div>
  );
}
