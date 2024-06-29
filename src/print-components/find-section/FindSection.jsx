import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import FirstFind from "../../components/research-dropdowns/table-dropdowns/FirstFind";
import TextFields from "../../components/TextFields/TextField";
import TableRadio from "../../components/table-radio/TableRadio";
import SecondFind from "../../components/research-dropdowns/table-dropdowns/SecondFind";
import Button from "../../components/custom/Button";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  textField: {
    "& .MuiInputBase-input": {
      fontSize: "0.8em",
    },
  },
  resize: {
    fontSize: "0.8em",
    height: 25,
  },
  headerCheckBox: {
    color: "white",
  },
}));
export const FindSection = ({
  selectedItems,
  setSelectedItems,
  qc2PrintTableData,
  setSearchedData,
  setTableLoading,
  // setQc2PrintTableData,
}) => {
  const classes = useStyles();
  const [headerForSearch, setHeaderForSearch] = useState("");
  const [secondHeaderForSearch, setSecondHeaderForSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [secondSearchValue, setSecondSearchValue] = useState("");
  const [selectedRadioValue, setSelectedRadioValue] = useState(null);

  const handleTableHeaderForSearch = (e) => {
    setHeaderForSearch(e.target.value);
  };
  const handleSecondTableHeaderForSearch = (e) => {
    setSecondHeaderForSearch(e.target.value);
  };
  const handleRadioChange = (event) => {
    if (!headerForSearch) {
      toast.error("Please Select a Header first", {
        autoClose: 2000,
      });
      return;
    }
    setSelectedRadioValue(event.target.value);
  };
  const handleSearch = () => {
    if (selectedItems.length > 0) {
      var userChoice = confirm("Do you want to uncheck previous selection?");

      if (userChoice) {
        setSelectedItems([]);
      }
    }
    setTableLoading(true);
    let output = [];

    if (headerForSearch === "all") {
      // Search across all data
      output = qc2PrintTableData.filter((rowData) => {
        const allRowValues = Object.values(rowData).join(" ").toLowerCase();
        return allRowValues.includes(searchValue.toLowerCase());
      });

      if (output.length === 0) {
        output = qc2PrintTableData;
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
      }
    } else if (headerForSearch !== "all" && !secondHeaderForSearch) {
      // Implement logic for searching within a specific header when only one header is chosen
      output = qc2PrintTableData.filter((rowData) => {
        const specificRowValue = (rowData[headerForSearch] ?? "")
          .toString()
          .toLowerCase();
        return specificRowValue.includes(searchValue.toLowerCase());
      });

      if (output.length === 0) {
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
        output = qc2PrintTableData; // Show all data when no matching rows are found
      }
    } else if (headerForSearch !== "all" && secondHeaderForSearch === "all") {
      if (!selectedRadioValue) {
        // No AND or OR condition selected
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...qc2PrintTableData];
      } else {
        output = qc2PrintTableData.filter((rowData) => {
          const firstHeaderValue = (rowData[headerForSearch] ?? "")
            .toString()
            .toLowerCase();
          const secondRowValues = Object.values(rowData)
            .join(" ")
            .toLowerCase();

          const firstCondition = firstHeaderValue.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = secondRowValues.includes(
            secondSearchValue.toLowerCase()
          );

          if (selectedRadioValue === "and") {
            return firstCondition && secondCondition;
          } else if (selectedRadioValue === "or") {
            return firstCondition || secondCondition;
          }
          return true; // Include all rows if no condition is selected
        });

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = qc2PrintTableData; // Show all data when no matching rows are found
        }
      }
      // eslint-disable-next-line no-dupe-else-if
    } else if (headerForSearch === "all" && secondHeaderForSearch === "all") {
      if (!selectedRadioValue) {
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...qc2PrintTableData];
      } else {
        const searchCriteria = (rowData) => {
          const allRowValues = Object.values(rowData).join(" ").toLowerCase();

          const firstCondition = allRowValues.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = allRowValues.includes(
            secondSearchValue.toLowerCase()
          );

          return selectedRadioValue === "and"
            ? firstCondition && secondCondition
            : firstCondition || secondCondition;
        };

        output = qc2PrintTableData.filter(searchCriteria);

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = qc2PrintTableData; // Show all data when no matching rows are found
        }
      }
    } else if (
      headerForSearch !== "all" &&
      secondHeaderForSearch !== "all" &&
      headerForSearch === secondHeaderForSearch
    ) {
      // Logic for searching with the same headers
      if (!selectedRadioValue) {
        // No AND or OR condition selected
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...qc2PrintTableData];
      } else {
        output = qc2PrintTableData.filter((rowData) => {
          const specificRowValue = (rowData[headerForSearch] ?? "")
            .toString()
            .toLowerCase();

          const firstCondition = specificRowValue.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = specificRowValue.includes(
            secondSearchValue.toLowerCase()
          );

          if (selectedRadioValue === "and") {
            return firstCondition && secondCondition;
          } else if (selectedRadioValue === "or") {
            return firstCondition || secondCondition;
          }
          return true; // Include all rows if no condition is selected
        });

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = qc2PrintTableData; // Show all data when no matching rows are found
        }
      }
    } else if (
      headerForSearch !== "all" &&
      secondHeaderForSearch !== "all" &&
      headerForSearch !== secondHeaderForSearch
    ) {
      // Logic for searching with different headers
      output = qc2PrintTableData.filter((rowData) => {
        const firstHeaderValue = (rowData[headerForSearch] ?? "")
          .toString()
          .toLowerCase();
        const secondHeaderValue = (rowData[secondHeaderForSearch] ?? "")
          .toString()
          .toLowerCase();

        // Implement logic for different headers including 'all' using AND and OR conditions
        if (selectedRadioValue === "and") {
          // Implement logic for AND condition for different headers
          return (
            firstHeaderValue.includes(searchValue.toLowerCase()) &&
            secondHeaderValue.includes(secondSearchValue.toLowerCase())
          );
        } else if (selectedRadioValue === "or") {
          // Implement logic for OR condition for different headers
          return (
            firstHeaderValue.includes(searchValue.toLowerCase()) ||
            secondHeaderValue.includes(secondSearchValue.toLowerCase())
          );
        }
        return true; // Include all rows if no condition is selected
      });

      if (output.length === 0) {
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
        output = qc2PrintTableData;
      }
    }

    setSearchedData(output);
    // setQc2PrintTableData(output);
    setTableLoading(false);
  };
  return (
    <div className="flex items-center gap-2">
      <FirstFind
        classes={classes}
        headerForSearch={headerForSearch}
        handleTableSearchUsingHeader={handleTableHeaderForSearch}
        screen={"print"}
      />
      <TextFields
        placeholder="Find Text"
        value={searchValue}
        setValue={setSearchValue}
      />
      <TableRadio
        selectedRadioValue={selectedRadioValue}
        handleChange={handleRadioChange}
      />
      <SecondFind
        classes={classes}
        secondHeaderForSearch={secondHeaderForSearch}
        handleSecondSearchUsingHeader={handleSecondTableHeaderForSearch}
        headerForSearch={headerForSearch}
        screen={"print"}
      />
      <TextFields
        placeholder="Find Text"
        value={secondSearchValue}
        setValue={setSecondSearchValue}
      />
      <Button btnText="Find" onClick={handleSearch} bg={"bg-primary"} />
    </div>
  );
};
FindSection.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  qc2PrintTableData: PropTypes.array.isRequired,
  setSearchedData: PropTypes.func.isRequired,
  setTableLoading: PropTypes.func.isRequired,
  setQc2PrintTableData: PropTypes.func.isRequired,
};
