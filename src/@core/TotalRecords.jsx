import PropTypes from "prop-types";

const TotalRecordsCard = ({ totalRecords, tClass }) => {
  return (
    <div
      className={`bg-white bg-opacity-50 border rounded-md shadow-lg w-[200px] h-[40px] absolute z-10 right-5 flex items-center ${tClass}`}
    >
      <h6 className="text-[0.8em] italic text-primary font-bold">
        Total records: {totalRecords}
      </h6>
    </div>
  );
};

TotalRecordsCard.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  tClass: PropTypes.string.isRequired,
};

export default TotalRecordsCard;
