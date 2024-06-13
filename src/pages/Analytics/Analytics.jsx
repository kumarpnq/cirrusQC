import { Box } from "@mui/material";
import { Fragment, useState } from "react";

// * next day date with current date
import { formattedDate, formattedNextDay } from "../../constants/dates";
import Button from "../../components/custom/Button";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";

const Analytics = () => {
  // * state variables
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  return (
    <Fragment>
      <Box>
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
        <Button btnText="Search" />
      </Box>
    </Fragment>
  );
};

export default Analytics;
