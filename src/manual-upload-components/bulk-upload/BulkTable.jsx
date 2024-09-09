import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const BulkTable = ({ data }) => {
  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "companyname", headerName: "Company Name", width: 200 },
    { field: "socialfeedid", headerName: "Social Feed ID", width: 180 },
    { field: "link", headerName: "Link", width: 300 },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    socialfeedid: item.SocialFeedId,
    date: item.Date,
    companyName: item.CompanyName,
    link: item.Link,
  }));
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </Box>
  );
};

BulkTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default BulkTable;
