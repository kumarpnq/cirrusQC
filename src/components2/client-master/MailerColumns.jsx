import { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Box,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: "100%",
  margin: 0,
  padding: "8px 12px", // increased padding for better spacing
  border: `1px solid ${theme.palette.text.primary}`, // border for each label
  transition: "all 0.3s ease", // smooth transition for hover effect
  display: "flex", // for better alignment of control and label
  alignItems: "center", // center content vertically
  cursor: "pointer", // pointer cursor on hover

  // Normal state styles
  "& .MuiFormControlLabel-label": {
    fontSize: "14px", // adjust font size
    color: theme.palette.text.primary, // use primary text color from theme
  },

  // Hover effect styles
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // background color on hover
    boxShadow: `0 4px 8px rgba(0, 123, 255, 0.2)`, // soft shadow on hover
  },

  // When the label is focused or checked
  "&.Mui-checked": {
    color: "#007BFF", // color when checked
    fontWeight: "bold", // make label bold when checked
  },

  "&:focus-within": {
    backgroundColor: theme.palette.action.selected, // background color on focus
  },

  // Last child border removal
  "&:last-child": {
    borderBottom: "none", // remove border for the last child
  },
}));

const MailerColumns = ({ clientId, setGlobalTabValue }) => {
  const [mailerColumns, setMailerColumns] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleCheckboxChange = (id) => {
    setMailerColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === id ? { ...col, checked: !col.checked } : col
      )
    );
  };

  const fetchMailerColumns = async () => {
    try {
      setFetchLoading(true);
      const response = await axiosInstance.get(
        `fetchMailerColumns/?clientId=${clientId}`
      );
      if (response.status === 200) {
        const columnsWithCheckedState = response.data.data.data.map((col) => ({
          ...col,
          checked: col.isActive === "Y",
        }));

        setMailerColumns(columnsWithCheckedState);
        setInitialState(columnsWithCheckedState);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMailerColumns();
  }, []);

  const handleUpdateColumns = async () => {
    try {
      setUpdateLoading(true);

      const modifiedColumns = mailerColumns
        .filter((col) => {
          const initialCol = initialState.find(
            (initCol) => initCol.id === col.id
          );
          return (
            col.checked !== (initialCol ? initialCol.isActive === "Y" : false)
          );
        })
        .map((col) => ({
          colId: col.id,
          isActive: col.checked ? "Y" : "N",
        }));

      if (modifiedColumns.length === 0) {
        toast.success("No changes to update.");
        return;
      }

      const requestData = {
        clientId,
        columns: modifiedColumns,
      };

      const response = await axiosInstance.post(
        `addRemoveMailerColumns/`,
        requestData
      );
      if (response.data.data?.data.success?.length) {
        const status = response.data.data?.data.success[0]?.message;
        toast.success(status);
        fetchMailerColumns();
        setGlobalTabValue(4);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box
      p={2}
      border="1px solid #ddd"
      borderRadius="4px"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box width={600}>
        <ComponentsHeader
          title="Mailers Column"
          loading={updateLoading}
          onSave={handleUpdateColumns}
        />
      </Box>
      {fetchLoading ? (
        <Box
          sx={{
            width: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <FormGroup sx={{ width: 600 }}>
          {mailerColumns.map((column) => (
            <StyledFormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.checked}
                  onChange={() => handleCheckboxChange(column.id)}
                  color="primary"
                />
              }
              label={column.name}
            />
          ))}
        </FormGroup>
      )}
    </Box>
  );
};

export default MailerColumns;
