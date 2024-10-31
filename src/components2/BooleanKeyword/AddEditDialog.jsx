import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Typography,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PropTypes from "prop-types";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import QueryBox from "./QueryBox";

const AddEditDialog = ({ open, handleClose }) => {
  const [isSplit, setIsSplit] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [includeExcludeTab, setIncludeExcludeTab] = useState(0);
  const [company, setCompany] = useState("CIRRUS DEMO");
  const [language, setLanguage] = useState("");

  const { data: languageData } = useFetchData(`${url}languagelist/`);
  const languageArray = Object.entries(languageData?.data?.languages || {}).map(
    ([language, code]) => ({
      language,
      code,
    })
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleIncludeExcludeTabChange = (event, newValue) => {
    setIncludeExcludeTab(newValue);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xxl"
      PaperProps={{
        style: {
          height: "99vh",
          width: "99vw",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle fontSize={"1em"}>Add/Edit Item</DialogTitle>
        <FormControlLabel
          label="Split"
          control={
            <Checkbox
              size="small"
              checked={isSplit}
              onChange={(e) => {
                setIsSplit(e.target.checked);
              }}
            />
          }
        />
      </Box>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="language tabs"
        >
          <Tab label="English" />
          <Tab label="Other" />
        </Tabs>
        <Divider />
        {isSplit && (
          <Tabs
            value={includeExcludeTab}
            onChange={handleIncludeExcludeTabChange}
            aria-label="keyword tabs"
          >
            <Tab
              label={
                <Tooltip title="Include Query">
                  <AddBoxIcon />
                </Tooltip>
              }
            />
            <Tab
              label={
                <Tooltip title="Exclude Query">
                  <DisabledByDefaultIcon />
                </Tooltip>
              }
            />
          </Tabs>
        )}

        {/* company & language filter */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
          className="flex items-center gap-1 p-2 mt-1 border border-gray-300 rounded-md shadow-lg"
        >
          <Typography
            component={"div"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <p>Company : </p>
            <TextField
              type="text"
              aria-readonly
              value={company}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                  width: 250,
                },
              }}
            />
          </Typography>
          {!!tabValue && (
            <>
              {" "}
              <Typography
                component={"div"}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <span>Language : </span>
                <CustomSingleSelect
                  options={languageArray}
                  dropdownToggleWidth={250}
                  dropdownWidth={250}
                  keyId="code"
                  keyName="language"
                  setSelectedItem={setLanguage}
                  selectedItem={language}
                  title="Language"
                />
              </Typography>
              <Button variant="outlined" size="small" type="submit">
                Search
              </Button>
            </>
          )}
        </form>
        {isSplit ? (
          <>
            {includeExcludeTab ? (
              <QueryBox isSplit={isSplit} />
            ) : (
              <QueryBox isSplit={isSplit} />
            )}
          </>
        ) : (
          <>
            {/* include query*/}
            <QueryBox isSplit={isSplit} type={"Include Query"} />
            {/* exclude query */}
            <QueryBox isSplit={isSplit} type={"Exclude Query"} />
          </>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleClose}
          color="primary"
          size="small"
          variant="outlined"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default AddEditDialog;
