import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// * third party imports
import axios from "axios";
import toast from "react-hot-toast";

// * components &  constants
import Client from "../print-components/dropdowns/Client";

import AddNewRow from "./AddNewRow";
import { url } from "../constants/baseUrl";

// * hooks
import useFetchData from "../hooks/useFetchData";

import Selector from "./Selector";
import { DataGrid } from "@mui/x-data-grid";

const BasketCityPubPage = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectorCompanies, setSelectorCompanies] = useState([]);
  // const [addNewRoCompany,setAddNewRowCompany] = useState([])
  const [tableData, setTableData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [highlightRows, setHighlightRows] = useState([]);
  const [tableFetchFlag, setTableFetchFalg] = useState(false);

  //   * data hooks
  const { data: clientData } = useFetchData(`${url}clientlist/`);

  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );
  const { data: cityData } = useFetchData(`${url}citieslist`);
  const { data: publicationGroupsData } = useFetchData(
    `${url}publicationgroupsall`
  );

  const fetchCBCPList = async () => {
    setFetchLoading(true);
    try {
      const clientid = selectedClient;
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url}CBCPList/`, {
        params: { clientid },
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      setTableData(response.data.result || []);
      setFetchLoading(false);
    } catch (error) {
      console.log(error.message);
      setTableData([]);
      setFetchLoading(false);
    } finally {
      setTableFetchFalg(false);
    }
  };

  useEffect(() => {
    fetchCBCPList();
  }, [selectedClient]);

  useEffect(() => {
    if (tableFetchFlag) {
      fetchCBCPList();
    }
  }, [tableFetchFlag]);

  const handleDeleteRow = async (row) => {
    const userToken = localStorage.getItem("user");
    const request_data = [
      {
        clientid: selectedClient,
        companyid: row.COMPANYID,
        cityid: row.CITYID,
        pubgroupid: row.PUBGROUPID,
        update_type: "D",
      },
    ];

    toast.promise(
      axios
        .post(`${url}updateCBCP/`, request_data, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((response) => {
          // On successful deletion, update the state to remove the deleted row
          setTableData((prevData) =>
            prevData.filter(
              (item) =>
                item.COMPANYID !== row.COMPANYID ||
                item.CITYID !== row.CITYID ||
                item.PUBGROUPID !== row.PUBGROUPID
            )
          );
          return response;
        }),
      {
        loading: "Deleting record...",
        success: "Record deleted successfully!",
        error: "Error while deleting record",
      }
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteRow(params.row)}>
          <ClearIcon />
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
    CLIENTID: item.CLIENTID,

    CLIENTNAME: item.CLIENTNAME,

    COMPANYID: item.COMPANYID,

    COMPANYNAME: item.COMPANYNAME,

    CITYID: item.CITYID,

    CITYNAME: item.CITYNAME,

    PUBGROUPID: item.PUBGROUPID,

    PUBGROUPNAME: item.PUBGROUPNAME,

    ISACTIVE: item.ISACTIVE,
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
    <Grid container sx={{ px: 2 }}>
      {/* First section */}
      <Grid item xs={12} sm={3}>
        <Box pl={2}>
          <Client
            label="Client"
            client={selectedClient}
            setClient={setSelectedClient}
            width={300}
            setCompanies={setSelectorCompanies}
          />
        </Box>
        <Selector
          cityData={cityData?.data?.cities || []}
          companyData={data?.data?.companies || []}
          publications={publicationGroupsData?.data?.publication_groups || []}
          clientid={selectedClient}
          companies={selectorCompanies}
          setCompanies={setSelectorCompanies}
          setTableFetchFlag={setTableFetchFalg}
        />
      </Grid>

      {/* Second section */}
      <Grid item xs={12} sm={8} md={9}>
        <Box display={"flex"} mt={1}>
          <AddNewRow
            cityOptions={cityData?.data?.cities || []}
            companyData={data?.data?.companies || []}
            publicationData={
              publicationGroupsData?.data?.publication_groups || []
            }
            tableData={rows}
            clientId={selectedClient}
            clientData={clientData?.data?.clients || []}
            setTableData={setTableData}
            setHighlightRows={setHighlightRows}
            setFetchFlag={setTableFetchFalg}
          />
          <Button>Save</Button>
        </Box>

        <Box sx={{ height: 560, width: "100%", mt: 1 }}>
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

export default BasketCityPubPage;
