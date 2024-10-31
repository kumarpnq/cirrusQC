import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
  tableHeader: {
    backgroundColor: "rgb(10 79 125)",
    color: "white",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  translateButton: {
    borderColor: "#1976d2",
    color: "#1976d2",
    "&:hover": {
      borderColor: "#0d47a1",
      color: "#0d47a1",
    },
  },
  queryCell: {
    padding: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const languages = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali (Bangla)", value: "bn" },
  { label: "Marathi", value: "mr" },
];

const data = [
  {
    id: 1,
    query: "Sample Query 1",
  },
  {
    id: 2,
    query: "Sample Query 2",
  },
  {
    id: 3,
    query: "Sample Query 3",
  },
];

const QueryTable = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTranslate = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 0.5, borderRadius: 2, boxShadow: 3 }}
    >
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell
              sx={{
                width: "15%",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              Action
            </TableCell>
            <TableCell
              sx={{
                width: "15%",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              Translate
            </TableCell>
            <TableCell
              sx={{
                width: "15%",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              Language
            </TableCell>
            <TableCell
              sx={{
                width: "55%",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              Query
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className={classes.tableRow}>
              <TableCell>
                <IconButton color="primary">
                  <EditNoteIcon />
                </IconButton>
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={handleTranslate}
                  size="small"
                  className={classes.translateButton}
                >
                  Translate
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Translate Option 1</MenuItem>
                  <MenuItem onClick={handleClose}>Translate Option 2</MenuItem>
                </Menu>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    displayEmpty
                    className={`${classes.dropDowns}`}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell className={classes.queryCell}>{row.query}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QueryTable;
