import PropTypes from "prop-types";

const FilteredRowCount = ({ filterRowCount }) => {
  const count = filterRowCount?.length;
  return (
    <div className="bg-primary text-white text-[0.9em] px-2 mt-2 rounded-md">
      {count} Filtered Rows
    </div>
  );
};

FilteredRowCount.propTypes = {
  filterRowCount: PropTypes.array,
};

export default FilteredRowCount;
