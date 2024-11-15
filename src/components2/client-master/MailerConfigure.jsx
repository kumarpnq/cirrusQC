import { useState } from "react";
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

const MailerConfigure = () => {
  const classes = useStyle();
  const initialData = [
    {
      id: 1,
      fieldName: "CompanyIndustry",
      fontName: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      selected: false,
    },
    {
      id: 2,
      fieldName: "Headline",
      fontName: "Roboto",
      fontSize: 14,
      fontColor: "#eb4034",
      selected: false,
    },
    {
      id: 3,
      fieldName: "PDF",
      fontName: "Verdana",
      fontSize: 12,
      fontColor: "#c70ad1",
      selected: false,
    },
    {
      id: 4,
      fieldName: "HTML",
      fontName: "Tahoma",
      fontSize: 14,
      fontColor: "#1d78d1",
      selected: false,
    },
    {
      id: 5,
      fieldName: "JPG",
      fontName: "Georgia",
      fontSize: 12,
      fontColor: "#0b6623",
      selected: false,
    },
    {
      id: 6,
      fieldName: "SPDF",
      fontName: "Arial",
      fontSize: 14,
      fontColor: "#ff5733",
      selected: false,
    },
    {
      id: 7,
      fieldName: "ArticleDate",
      fontName: "Roboto",
      fontSize: 14,
      fontColor: "#000000",
      selected: false,
    },
    {
      id: 8,
      fieldName: "PublicationName",
      fontName: "Verdana",
      fontSize: 12,
      fontColor: "#003366",
      selected: false,
    },
    {
      id: 9,
      fieldName: "Edition",
      fontName: "Tahoma",
      fontSize: 12,
      fontColor: "#800080",
      selected: false,
    },
    {
      id: 10,
      fieldName: "Journalist",
      fontName: "Georgia",
      fontSize: 14,
      fontColor: "#FF4500",
      selected: false,
    },
    {
      id: 11,
      fieldName: "Summary",
      fontName: "Arial",
      fontSize: 12,
      fontColor: "#00008B",
      selected: false,
    },
    {
      id: 12,
      fieldName: "Size",
      fontName: "Roboto",
      fontSize: 14,
      fontColor: "#2E8B57",
      selected: false,
    },
    {
      id: 13,
      fieldName: "PageNumber",
      fontName: "Verdana",
      fontSize: 12,
      fontColor: "#800000",
      selected: false,
    },
    {
      id: 14,
      fieldName: "MAV",
      fontName: "Arial",
      fontSize: 14,
      fontColor: "#8B0000",
      selected: false,
    },
    {
      id: 15,
      fieldName: "Circulation",
      fontName: "Roboto",
      fontSize: 12,
      fontColor: "#4682B4",
      selected: false,
    },
    {
      id: 16,
      fieldName: "CompanyMatched",
      fontName: "Georgia",
      fontSize: 14,
      fontColor: "#DAA520",
      selected: false,
    },
    {
      id: 17,
      fieldName: "KeywordMatched",
      fontName: "Verdana",
      fontSize: 12,
      fontColor: "#FF1493",
      selected: false,
    },
    {
      id: 18,
      fieldName: "Social",
      fontName: "Tahoma",
      fontSize: 12,
      fontColor: "#FF6347",
      selected: false,
    },
    {
      id: 19,
      fieldName: "SimilarArticles",
      fontName: "Arial",
      fontSize: 14,
      fontColor: "#8A2BE2",
      selected: false,
    },
    {
      id: 20,
      fieldName: "Engagement",
      fontName: "Roboto",
      fontSize: 14,
      fontColor: "#20B2AA",
      selected: false,
    },
    {
      id: 21,
      fieldName: "Reach",
      fontName: "Verdana",
      fontSize: 12,
      fontColor: "#DC143C",
      selected: false,
    },
    {
      id: 22,
      fieldName: "URL",
      fontName: "Tahoma",
      fontSize: 12,
      fontColor: "#4169E1",
      selected: false,
    },
    {
      id: 23,
      fieldName: "Tonality",
      fontName: "Georgia",
      fontSize: 14,
      fontColor: "#000000",
      selected: false,
    },
  ];

  const [tableData, setTableData] = useState(initialData);

  const fontOptions = ["Arial", "Roboto", "Verdana", "Tahoma", "Georgia"];

  const handleCheckboxChange = (id) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const handleFontChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, fontName: value } : row))
    );
  };

  const handleFontSizeChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, fontSize: value } : row))
    );
  };

  const handleColorChange = (id, value) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, fontColor: value } : row))
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <ComponentsHeader
        title="Mailer Configuration"
        loading={false}
        onSave={() => {}}
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
              <StyledTableRow key={row.id}>
                <StyledTableCell>
                  <Checkbox
                    checked={row.selected}
                    onChange={() => handleCheckboxChange(row.id)}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>{row.fieldName}</StyledTableCell>
                <StyledTableCell>
                  <Select
                    select
                    value={row.fontName}
                    onChange={(e) => handleFontChange(row.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    className={classes.dropDowns}
                  >
                    {fontOptions.map((font) => (
                      <MenuItem key={font} value={font}>
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
                      handleFontSizeChange(row.id, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    InputProps={{ min: 8, max: 72, style: { height: 25 } }}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    type="color"
                    value={row.fontColor}
                    onChange={(e) => handleColorChange(row.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ width: 50 }}
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
