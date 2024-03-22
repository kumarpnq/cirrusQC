import PropTypes from "prop-types";
import { recordsPerPage } from "../../constants/dataArray";
import { toast } from "react-toastify";
import { useEffect } from "react";

const SetRecords = ({
  records,
  setRecords,
  pageNumber,
  totalRecordsCount,
  setFetchingUsingPrevNext,
}) => {
  const handleChange = (e) => {
    let value = Number(e.target.value);
    if (pageNumber !== 1) return toast.warning("Please Move on First Page");
    setRecords(value);
  };
  useEffect(() => {
    if (totalRecordsCount > records) setFetchingUsingPrevNext(true);
  }, [records]);
  return (
    <select
      value={records}
      onChange={handleChange}
      aria-label="Select"
      className="mx-2 border border-black outline-none"
    >
      {recordsPerPage.map((record) => (
        <option key={record} value={record}>
          {record}
        </option>
      ))}
    </select>
  );
};

SetRecords.propTypes = {
  records: PropTypes.number.isRequired,
  setRecords: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  setFetchingUsingPrevNext: PropTypes.func.isRequired,
  totalRecordsCount: PropTypes.number,
};

export default SetRecords;
