import { Box, Divider } from "@mui/material";
import { useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMovieData } from "@mui/x-data-grid-generator";

// * next day date with current date
import { formattedDate, formattedNextDay } from "../../constants/dates";

// * demo component imports
import Button from "../../components/custom/Button";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";

const VISIBLE_FIELDS = [
  "title",
  "company",
  "director",
  "year",
  "cinematicUniverse",
];

const Analytics = () => {
  // * state variables
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);

  const data = useMovieData();

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  const handleFetchRecords = async () => {
    try {
      const response = await axios.get("/test");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="px-3">
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
        <Button btnText="Search" onClick={handleFetchRecords} />
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ height: 400, width: 1 }}>
        <DataGrid
          {...data}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </div>
  );
};

export default Analytics;
