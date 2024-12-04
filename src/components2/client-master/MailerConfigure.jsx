import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { styled } from "@mui/system";
import ComponentsHeader from "./ComponentsHeader";
import { makeStyles } from "@mui/styles";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import useFetchMongoData from "../../hooks/useFetchMongoData";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px", // Ensures consistent padding across columns
  fontSize: "0.875rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: "left", // Keeps text alignment consistent
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: "bold",
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  padding: "10px 16px",
  textAlign: "left",
  minWidth: 150, // Adjust as per requirement to ensure consistent width
}));

const MailerConfigure = ({ clientId }) => {
  const classes = useStyle();

  const [initialState, setInitialState] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const fetchMailerConfigure = async () => {
    const params = {
      clientId,
      configName: "default",
    };
    const response = await axiosInstance.get(`clientMailerConfig/`, {
      params,
    });
    let localData = response.data.data.data || [];
    setTableData(localData);
    setInitialState(localData);
  };

  useEffect(() => {
    fetchMailerConfigure();
  }, [clientId]);

  const { data: fontData } = useFetchMongoData("fontsDDL/");
  const fontsArray = fontData?.data?.data?.feildList || [];

  const handleCheckboxChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.fieldId === id ? { ...row, isActive: value } : row
      )
    );
  };

  const handleFontChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) => (row.fieldId === id ? { ...row, fontId: value } : row))
    );
  };

  const handleFontSizeChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.fieldId === id ? { ...row, fontSize: value } : row
      )
    );
  };

  const handleColorChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.fieldId === id ? { ...row, fontColor: value } : row
      )
    );
  };

  const updateMailerConfigure = async () => {
    const updatedData = tableData.filter(
      (row, index) =>
        row.isActive !== initialState[index].isActive ||
        row.fontId !== initialState[index].fontId ||
        row.fontSize !== initialState[index].fontSize ||
        row.fontColor !== initialState[index].fontColor
    );
    if (updatedData.length === 0) {
      toast.error("No changes detected");
      return;
    }
    try {
      setUpdateLoading(true);
      const requestData = {
        configName: "default",
        clientId,
        conFig: updatedData,
      };
      const response = await axiosInstance.post(
        "updateClientMailerConfig/",
        requestData
      );
      if (response.status === 200) {
        let success = response.data.data.success[0]?.status;
        toast.success(success);
        fetchMailerConfigure();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ComponentsHeader
        title="Mailer Configuration"
        loading={updateLoading}
        onSave={updateMailerConfigure}
      />
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Select</StyledTableHeadCell>
              <StyledTableHeadCell>Field Name</StyledTableHeadCell>
              <StyledTableHeadCell>Font Name</StyledTableHeadCell>
              <StyledTableHeadCell>Font Size</StyledTableHeadCell>
              <StyledTableHeadCell>Font Color</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <StyledTableRow key={row.fieldId}>
                <StyledTableCell sx={{ width: 50 }}>
                  <Select
                    value={row?.isActive}
                    onChange={(e) =>
                      handleCheckboxChange(row.fieldId, e.target.value)
                    }
                    sx={{ fontSize: "0.9em" }}
                    className={classes.dropDowns}
                  >
                    <MenuItem value="Y" sx={{ fontSize: "0.9em" }}>
                      Yes
                    </MenuItem>
                    <MenuItem value="N" sx={{ fontSize: "0.9em" }}>
                      No
                    </MenuItem>
                  </Select>
                </StyledTableCell>
                <StyledTableCell sx={{ width: 250 }}>
                  {row.fieldName}
                </StyledTableCell>
                <StyledTableCell sx={{ width: 250 }}>
                  <Select
                    select
                    value={row.fontId}
                    onChange={(e) =>
                      handleFontChange(row.fieldId, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    className={classes.dropDowns}
                    sx={{ fontFamily: row.fontName, fontSize: "0.9em" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250, // Set the dropdown height to 250px
                        },
                      },
                    }}
                  >
                    {fontsArray.map((font) => (
                      <MenuItem
                        key={font.id}
                        value={font.id}
                        style={{ fontFamily: font.name, fontSize: "0.9em" }}
                      >
                        {font.name}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledTableCell>
                <StyledTableCell sx={{ width: 250 }}>
                  <TextField
                    type="number"
                    value={row.fontSize}
                    onChange={(e) =>
                      handleFontSizeChange(row.fieldId, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    InputProps={{
                      min: 8,
                      max: 72,
                      style: {
                        height: 25,
                        fontSize: `${row.fontSize}px`,
                        width: 250,
                      },
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell sx={{ width: 50 }}>
                  <TextField
                    type="color"
                    value={row.fontColor}
                    onChange={(e) =>
                      handleColorChange(row.fieldId, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 50,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: row.fontColor,
                        },
                        "&:hover fieldset": {
                          borderColor: row.fontColor,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: row.fontColor,
                        },
                      },
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default MailerConfigure;
