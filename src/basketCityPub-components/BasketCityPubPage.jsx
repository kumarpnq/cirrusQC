import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// * third party imports
import toast from "react-hot-toast";
import PropTypes from "prop-types";

import AddNewRow from "./AddNewRow";
import { url } from "../constants/baseUrl";

// * hooks
import useFetchData from "../hooks/useFetchData";

import Selector from "./Selector";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../axiosConfig";

const BasketCityPubPage = ({ row }) => {
  const [tableData, setTableData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [highlightRows, setHighlightRows] = useState([]);
  const [pubFields, setPubFields] = useState({
    companies: [],
    cities: [],
    pubGroups: [],
  });
  const [deleteLoadingId, setDeleteLoadingId] = useState("");

  const { data } = useFetchData(`${url}companylist/${row?.clientId}`);
  const { data: cityData } = useFetchData(`${url}citieslist`);
  const { data: publicationGroupsData } = useFetchData(
    `${url}publicationgroupsall`
  );

  const fetchCBCPList = async () => {
    setFetchLoading(true);
    try {
      const clientId = row?.clientId;

      const response = await axiosInstance.get(`cbcp/`, {
        params: { clientId },
      });
      setTableData(response.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchClusterData = async () => {
    try {
      const params = {
        clientId: row?.clientId,
        mediaType: "print",
      };
      const response = await axiosInstance.get(`clusterData/`, { params });
      const clusterData = response.data.data.data || {};
      setPubFields({
        ...clusterData,
      });
    } catch (error) {
      toast.error("error");
    }
  };

  useEffect(() => {
    fetchClusterData();
    fetchCBCPList();
  }, []);

  const handleDeleteRow = async (row) => {
    try {
      setDeleteLoadingId(row.id);
      const params = {
        clientId: row?.CLIENTID,
        companyId: row.COMPANYID,
        cityId: row.CITYID,
        pubGroupId: row.PUBGROUPID,
      };
      const response = await axiosInstance.delete(`removeCbcp`, { params });
      if (response.status === 200) {
        toast.success(response.data.data.message);
        fetchCBCPList();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setDeleteLoadingId("");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteRow(params.row)}>
          {deleteLoadingId === params.row.id ? (
            <CircularProgress size={"1em"} />
          ) : (
            <ClearIcon />
          )}
        </IconButton>
      ),
    },
    { field: "CLIENTNAME", headerName: "Client", width: 200 },
    { field: "COMPANYNAME", headerName: "Company", width: 200 },
    { field: "CITYNAME", headerName: "City", width: 200 },
    { field: "PUBGROUPNAME", headerName: "Publication", width: 200 },
    { field: "ISACTIVE", headerName: "Active", width: 200 },
  ];

  const rows = tableData.map((item, index) => ({
    id: index,
    CLIENTID: item.clientId,

    CLIENTNAME: item.clientName,

    COMPANYID: item.companyId,

    COMPANYNAME: item.companyName,

    CITYID: item.cityId,

    CITYNAME: item.cityName,

    PUBGROUPID: item.pubGroupId,

    PUBGROUPNAME: item.publicationName,

    ISACTIVE: item.isActive,
  }));

  const getRowClassName = (params) => {
    return highlightRows.some(
      (row) =>
        row.clientid === params.row.CLIENTID &&
        row.companyid === params.row.COMPANYID &&
        row.cityid === params.row.CITYID &&
        row.pubgroupid === params.row.PUBGROUPID
    )
      ? "highlight-row"
      : "";
  };

  return (
    <Grid
      container
      sx={{
        px: 2,
        flexDirection: { xs: "column", sm: "row" }, // Ensure responsiveness
      }}
    >
      {/* First section */}
      <Grid
        item
        xs={12}
        sm={3}
        mt={1}
        border={"1px solid #ccc"}
        py={0.5}
        borderRadius={"3px"}
        order={{ xs: 1, sm: 1 }}
      >
        <Box pl={2}>
          <TextField
            value={row?.clientName}
            InputProps={{
              readOnly: true,
              style: {
                height: 25,
                fontSize: "0.9em",
                width: 300,
              },
            }}
            sx={{ fontSize: "0.9em" }}
          />
        </Box>
        <Selector
          cityData={cityData?.data?.cities || []}
          companyData={data?.data?.companies || []}
          publications={publicationGroupsData?.data?.publication_groups || []}
          clientId={row?.clientId}
          clusterData={pubFields}
          fetchCBCP={fetchCBCPList}
        />
      </Grid>

      {/* Second section */}
      <Grid item xs={12} sm={8} md={9} order={{ xs: 2, sm: 2 }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          mt={1}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: 1,
          }}
        >
          <AddNewRow
            cityOptions={cityData?.data?.cities || []}
            companyData={data?.data?.companies || []}
            publicationData={
              publicationGroupsData?.data?.publication_groups || []
            }
            tableData={rows}
            clientId={row?.clientId}
            clientData={[]}
            setTableData={setTableData}
            setHighlightRows={setHighlightRows}
            fetchCbCp={fetchCBCPList}
          />
        </Box>

        <Box sx={{ height: "80vh", width: "100%", mt: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            density="compact"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            loading={fetchLoading && <CircularProgress />}
            getRowClassName={getRowClassName}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

BasketCityPubPage.propTypes = {
  row: PropTypes.shape({
    clientId: PropTypes.string,
    clientName: PropTypes.string,
  }).isRequired,
};
export default BasketCityPubPage;
