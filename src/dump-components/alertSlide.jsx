import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// ** third party imports
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../constants/baseUrl";
import CustomButton from "../components/custom/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const {
    open,
    setOpen,
    data,
    selectedColumnForDump,
    setSelectedColumnsForDump,
    tabValue,
    clientId,
    companyId,
    dateType,
    fromDate,
    toDate,
    qc1By,
    qc2By,
    isQc1,
    isQc2,
    qcPermission,
    setFetchDumpData,
  } = props;
  const endPoint = !tabValue ? "onlinedump/" : "printdump/";
  const userToken = localStorage.getItem("user");
  const [dumpLoading, setDumpLoading] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCheckboxChange = (key) => (event) => {
    if (event.target.checked) {
      setSelectedColumnsForDump([...selectedColumnForDump, key]);
    } else {
      setSelectedColumnsForDump(
        selectedColumnForDump.filter((selectedKey) => selectedKey !== key)
      );
    }
  };
  const handleSelectAll = () => {
    const allKeys = Object.keys(data);
    setSelectedColumnsForDump(allKeys);
  };

  const handleClearAll = async () => {
    setSelectedColumnsForDump([]);
  };
  const handleDump = async () => {
    if (!selectedColumnForDump.length) {
      return toast.error("Please select at least one column.");
    }

    const arrayToString = (arr) => {
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((item) => `'${item}'`).join(",");
      }
      return "";
    };

    try {
      const request_data = {
        client_id: clientId,
        date_type: dateType,
        from_date: fromDate,
        to_date: toDate,
        field_list: selectedColumnForDump,
      };

      if (companyId && companyId.length > 0) {
        request_data.company_id = arrayToString(companyId);
      }
      if (qc1By && qc1By.length > 0) {
        request_data.qc1_by = arrayToString(qc1By);
      }
      if (qc2By && qc2By.length > 0) {
        request_data.qc2_by = arrayToString(qc2By);
      }
      if (isQc1) {
        request_data.is_qc1 = Number(isQc1);
      }
      if (isQc2) {
        request_data.is_qc2 = Number(isQc2);
      }
      if (tabValue) {
        request_data.permission = qcPermission;
      }
      setDumpLoading((prev) => !prev);
      const response = await axios.post(`${url}${endPoint}`, request_data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        // responseType: "blob",
      });

      // const blob = new Blob([response.data], {
      //   type: "application/octet-stream",
      // });
      // const filename = `${clientId + endPoint.slice(0, -1)}.xlsx`;

      // const urls = window.URL.createObjectURL(blob);

      // const link = document.createElement("a");
      // link.href = urls;
      // link.setAttribute("download", filename);
      // document.body.appendChild(link);
      // link.click();

      // window.URL.revokeObjectURL(urls);
      setDumpLoading((prev) => !prev);
      if (response) {
        setFetchDumpData(true);
        setOpen(false);
        toast.success(response.data.message);
        setSelectedColumnsForDump([]);
      }
    } catch (error) {
      toast.error(error?.message || "Error while dump.");
      setDumpLoading((prev) => !prev);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle fontSize={"1em"}>{"Select Column"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
          className="bg-secondory"
        >
          <CustomButton btnText="Select All" onClick={handleSelectAll} />
          <CustomButton btnText="Clear All" onClick={handleClearAll} />
        </Box>
        <FormControl
          sx={{ display: "grid", gridTemplateColumns: "repeat(2,auto)" }}
        >
          {Object.entries(data).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={selectedColumnForDump.includes(key)}
                  onChange={handleCheckboxChange(key)}
                />
              }
              label={<Typography fontSize={"0.9em"}>{value}</Typography>}
            />
          ))}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <CustomButton btnText="Close" onClick={handleClose} />
        {dumpLoading ? (
          <CircularProgress thickness={1} />
        ) : (
          <CustomButton
            btnText="Download"
            onClick={handleDump}
            isLoading={dumpLoading}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

AlertDialogSlide.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  selectedColumnForDump: PropTypes.array.isRequired,
  setSelectedColumnsForDump: PropTypes.func.isRequired,
  tabValue: PropTypes.number.isRequired,
  clientId: PropTypes.string.isRequired,
  companyId: PropTypes.array.isRequired,
  dateType: PropTypes.string.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  qc1By: PropTypes.array.isRequired,
  qc2By: PropTypes.array.isRequired,
  isQc1: PropTypes.any.isRequired,
  isQc2: PropTypes.any.isRequired,
  qcPermission: PropTypes.number.isRequired,
  setFetchDumpData: PropTypes.func.isRequired,
};
