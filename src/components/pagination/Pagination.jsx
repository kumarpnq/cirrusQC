import { TbPlayerTrackPrev, TbPlayerTrackNext } from "react-icons/tb";
import { useContext } from "react";
import { ResearchContext } from "../../context/ContextProvider";
import PropTypes from "prop-types";
import SetRecords from "../set-records/SetRecords";

const Pagination = ({
  tableData,
  setFetchingUsingPrevNext,
  totalRecordsCount,
}) => {
  const { pageNumber, setPageNumber, recordsPerPage, setRecordsPerPage } =
    useContext(ResearchContext);
  const isPrevDisabled = pageNumber === 1;
  const isNextDisabled = tableData.length < recordsPerPage;
  // Calculate the range of items on the current page
  const startIndex = (pageNumber - 1) * recordsPerPage + 1;
  const endIndex =
    tableData.length < recordsPerPage
      ? pageNumber * recordsPerPage - recordsPerPage + tableData.length
      : recordsPerPage * pageNumber;
  const pageValueToShow =
    tableData.length === 0 ? 0 : `${startIndex}-${endIndex}`;

  const handlePrev = () => {
    setFetchingUsingPrevNext(true);
    if (!isPrevDisabled) setPageNumber((prev) => prev - 1);
  };

  const handleNext = () => {
    setFetchingUsingPrevNext(true);
    setPageNumber((prev) => prev + 1);
  };

  return (
    <div className="flex items-center gap-2 ">
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={` border border-gray-400 rounded px-10 uppercase text-white mt-3 tracking-wider ${
          isPrevDisabled ? "cursor-not-allowed bg-slate-400" : "bg-primary"
        }`}
      >
        <TbPlayerTrackPrev />
      </button>
      <p className="text-[0.9em] mt-3">
        <SetRecords
          records={recordsPerPage}
          setRecords={setRecordsPerPage}
          pageNumber={pageNumber}
          setFetchingUsingPrevNext={setFetchingUsingPrevNext}
          totalRecordsCount={totalRecordsCount}
        />
        {` ${pageValueToShow} of ${totalRecordsCount}`}
      </p>
      <button
        onClick={handleNext}
        className={`bg-primary border border-gray-400 rounded px-10 uppercase text-white mt-3 tracking-wider ${
          isNextDisabled ? "cursor-not-allowed bg-slate-400" : "bg-primary"
        }
          `}
        disabled={isNextDisabled}
      >
        <TbPlayerTrackNext />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  tableData: PropTypes.array.isRequired,
  setFetchingUsingPrevNext: PropTypes.func.isRequired,
  totalRecordsCount: PropTypes.number,
};

export default Pagination;
