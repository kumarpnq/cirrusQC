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
import { Virtuoso } from "react-virtuoso";
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
  padding: "8px 16px",
  fontSize: "0.875rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: "bold",
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  padding: "10px 16px",
  textAlign: "left",
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

  const { data: fontData } = useFetchMongoData("mailerFonts");

  const fontOptions = ["Arial", "Roboto", "Verdana", "Tahoma", "Georgia"];

  const handleCheckboxChange = useCallback((id) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    );
  }, []);

  const handleFontChange = useCallback((id, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.fieldId === id ? { ...row, fontName: value } : row
      )
    );
  }, []);

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
        row.fontName !== initialState[index].fontName ||
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
        let success = response.data.data.success.length;
        let error = response.data.data.error.length;
        if (success > 0 && error == 0) {
          toast.success(success[0]?.status);
          fetchMailerConfigure();
        }
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ComponentsHeader
        title="Mailer Configuration"
        loading={false}
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
                <StyledTableCell>
                  <Checkbox
                    checked={row.selected}
                    onChange={() => handleCheckboxChange(row.fieldId)}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>{row.fieldName}</StyledTableCell>
                <StyledTableCell>
                  <Select
                    select
                    value={row.fontName}
                    onChange={(e) =>
                      handleFontChange(row.fieldId, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    className={classes.dropDowns}
                    sx={{ fontFamily: row.fontName, fontSize: "0.9em" }}
                  >
                    {fontOptions.map((font) => (
                      <MenuItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font, fontSize: "0.9em" }}
                      >
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledTableCell>
                <StyledTableCell>
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
                      },
                    }}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
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
