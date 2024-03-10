import noPenaltyPng from "../../../images/no-penalties-illustration.png";

export default function NoPenaltyData() {
  return (
    <div className="portlet-body no-penalties__wrapper">
      <img
        src={noPenaltyPng}
        alt="Missing data illustration"
        className="no-data__image"
      />
      <p className="no-data">
        There are no penalties added at the moment! <br />
        You can add them by filling out te form on the left.
      </p>
    </div>
  );
}
