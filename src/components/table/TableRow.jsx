import { memo, useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import PropTypes from "prop-types";
import { AiOutlineLoading } from "react-icons/ai";

const TableRowCheckBox = ({
  setSelectedRowData,
  selectedRowData,
  searchedData,
  rowData,
}) => {
  const [checkBoxLoading, setCheckBoxLoading] = useState(false);

  useEffect(() => {
    if (checkBoxLoading) {
      // Add a slight delay before setting checkBoxLoading to false
      const timeoutId = setTimeout(() => {
        setCheckBoxLoading(false);
      }, 200); // Adjust the delay time as needed

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [checkBoxLoading]);

  const handleRowSelect = (rowData) => {
    setCheckBoxLoading(true);

    // Simulate an asynchronous operation (replace this with your actual logic)
    setTimeout(() => {
      setSelectedRowData((prevSelectedRows) => {
        if (!Array.isArray(prevSelectedRows)) {
          // If prevSelectedRows is not an array, initialize it as an empty array
          prevSelectedRows = [];
        }

        const isSelected = prevSelectedRows.some((row) => row === rowData);

        if (isSelected) {
          return prevSelectedRows.filter((row) => row !== rowData);
        } else {
          if (searchedData.length > 0) {
            // Check if the selected row is within the searched data
            if (searchedData.includes(rowData)) {
              return [...prevSelectedRows, rowData];
            }
          } else {
            return [...prevSelectedRows, rowData];
          }
        }
        return prevSelectedRows;
      });

      setCheckBoxLoading(false);
    }, 0);
  };

  return (
    <>
      {checkBoxLoading ? (
        <div className="loading-spinner">
          <AiOutlineLoading />
        </div>
      ) : (
        <Checkbox
          size="small"
          checked={selectedRowData.includes(rowData)}
          onChange={() => handleRowSelect(rowData)}
          style={{ color: "gray" }}
        />
      )}
    </>
  );
};

TableRowCheckBox.propTypes = {
  setSelectedRowData: PropTypes.func,
  selectedRowData: PropTypes.array.isRequired,
  searchedData: PropTypes.array.isRequired,
  rowData: PropTypes.object.isRequired,
};

export default memo(TableRowCheckBox);
