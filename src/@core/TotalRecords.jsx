import PropTypes from "prop-types";

const TotalRecordsCard = ({ totalRecords, tClass }) => {
  return (
    <div
      className={`border rounded-md shadow-lg w-[200px] h-[40px] flex items-center justify-start ${tClass}`}
    >
      <h6 className="text-[0.8em] text-primary font-bold">
        Total Records: {totalRecords}
      </h6>
    </div>
  );
};

TotalRecordsCard.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  tClass: PropTypes.string.isRequired,
};

export default TotalRecordsCard;
