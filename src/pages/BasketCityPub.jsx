import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// * third party imports
import axios from "axios";
import toast from "react-hot-toast";

// * components &  constants
import Client from "../print-components/dropdowns/Client";

import AddNewRow from "../basketCityPub-components/AddNewRow";
import { url } from "../constants/baseUrl";

// * hooks
import useFetchData from "../hooks/useFetchData";

import Selector from "../basketCityPub-components/Selector";
import { DataGrid } from "@mui/x-data-grid";

const publications = [
  {
    publicationgroupid: "AM",
    publicationgroupname: "Ahmedabad Mirror",
  },
  {
    publicationgroupid: "6",
    publicationgroupname: "Asian Age",
  },
  {
    publicationgroupid: "Bangalore Mirror",
    publicationgroupname: "Bangalore Mirror",
  },
  {
    publicationgroupid: "773",
    publicationgroupname: "Business Standard",
  },
  {
    publicationgroupid: "999",
    publicationgroupname: "DNA",
  },
  {
    publicationgroupid: "10",
    publicationgroupname: "Deccan Chronicle",
  },
  {
    publicationgroupid: "19",
    publicationgroupname: "Deccan Herald",
  },
  {
    publicationgroupid: "FINCHRONICLE",
    publicationgroupname: "Financial Chronicle",
  },
  {
    publicationgroupid: "998",
    publicationgroupname: "Free Press Journal",
  },
  {
    publicationgroupid: "1727",
    publicationgroupname: "Hindustan Times",
  },
  {
    publicationgroupid: "MAIL TODAY",
    publicationgroupname: "Mail Today",
  },
  {
    publicationgroupid: "997",
    publicationgroupname: "Mint",
  },
  {
    publicationgroupid: "MUMBAIMIRROR",
    publicationgroupname: "Mumbai Mirror",
  },
  {
    publicationgroupid: "996",
    publicationgroupname: "Pioneer",
  },
  {
    publicationgroupid: "SAKAL TIMES",
    publicationgroupname: "Sakal Times",
  },
  {
    publicationgroupid: "48",
    publicationgroupname: "The Economic Times",
  },
  {
    publicationgroupid: "21",
    publicationgroupname: "The Financial Express",
  },
  {
    publicationgroupid: "HH",
    publicationgroupname: "The Hans India",
  },
  {
    publicationgroupid: "23",
    publicationgroupname: "The Hindu",
  },
  {
    publicationgroupid: "35",
    publicationgroupname: "The Indian Express",
  },
  {
    publicationgroupid: "36",
    publicationgroupname: "The New Indian Express",
  },
  {
    publicationgroupid: "46",
    publicationgroupname: "The Telegraph",
  },
  {
    publicationgroupid: "1769",
    publicationgroupname: "The Times Of India",
  },
  {
    publicationgroupid: "199",
    publicationgroupname: "Tribune",
  },
  {
    publicationgroupid: "TRNT_MIRR",
    publicationgroupname: "Trinity Mirror",
  },
  {
    publicationgroupid: "WSTRNTMS",
    publicationgroupname: "Western Times",
  },
  {
    publicationgroupid: " Northeast Sun ",
    publicationgroupname: " Northeast Sun ",
  },
  {
    publicationgroupid: "123Bharat",
    publicationgroupname: "123Bharat.com",
  },
  {
    publicationgroupid: "20ti",
    publicationgroupname: "20 Minuten",
  },
  {
    publicationgroupid: "20-mi",
    publicationgroupname: "20 Minutes",
  },
  {
    publicationgroupid: "20mt",
    publicationgroupname: "20 Minutos",
  },
  {
    publicationgroupid: "715",
    publicationgroupname: "365 din",
  },
  {
    publicationgroupid: "ADI",
    publicationgroupname: "A & D INDIA",
  },
  {
    publicationgroupid: "AAA",
    publicationgroupname: "A & S INDIA",
  },
  {
    publicationgroupid: "AAJ1",
    publicationgroupname: "AAJ",
  },
  {
    publicationgroupid: "AAJ_KI_DELHI",
    publicationgroupname: "AAJ KI DELHI",
  },
  {
    publicationgroupid: "SDFTHTJ",
    publicationgroupname: "AAJ KI JANDHARNA",
  },
  {
    publicationgroupid: "ac",
    publicationgroupname: "ABC",
  },
  {
    publicationgroupid: "ABHIVYAKTI EXPRESS ",
    publicationgroupname: "ABHIVYAKTI EXPRESS ",
  },
  {
    publicationgroupid: "ACTION TODAY",
    publicationgroupname: "ACTION TODAY",
  },
  {
    publicationgroupid: "adar",
    publicationgroupname: "AD Architectural Digest",
  },
  {
    publicationgroupid: "ADARSH MAHARASTRA",
    publicationgroupname: "ADARSH MAHARASTRA",
  },
  {
    publicationgroupid: "ADHIKR",
    publicationgroupname: "ADHIKAR",
  },
  {
    publicationgroupid: "AGAMI ORISSA",
    publicationgroupname: "AGAMI ORISSA",
  },
  {
    publicationgroupid: "Ag_Da",
    publicationgroupname: "AGNI DARSHAN",
  },
  {
    publicationgroupid: "AGR_BHARAT",
    publicationgroupname: "AGR BHARAT",
  },
  {
    publicationgroupid: "AHWAL-E-BENGA",
    publicationgroupname: "AHWAL-E-BENGA",
  },
  {
    publicationgroupid: "Aic_Samb",
    publicationgroupname: "AICHIK SAMBAD",
  },
  {
    publicationgroupid: "AJIGUW",
    publicationgroupname: "AJI",
  },
  {
    publicationgroupid: "ajnali",
    publicationgroupname: "AJKER NALISH",
  },
  {
    publicationgroupid: "Say_saan",
    publicationgroupname: "AJKER SATYA SADHAN",
  },
  {
    publicationgroupid: "Aj_su",
    publicationgroupname: "AJKER SUPRABHAT",
  },
  {
    publicationgroupid: "AKOLA",
    publicationgroupname: "AKOLA",
  },
  {
    publicationgroupid: "AM SAHAR AM KHABAR",
    publicationgroupname: "AM SAHAR AM KHABAR",
  },
  {
    publicationgroupid: "AM_HAIN",
    publicationgroupname: "AMAN CHAIN",
  },
  {
    publicationgroupid: "AMBALA",
    publicationgroupname: "AMBALA",
  },
  {
    publicationgroupid: "Am_ni",
    publicationgroupname: "AMBIKAVANI",
  },
  {
    publicationgroupid: "AMRAVATI_455",
    publicationgroupname: "AMRAVATI KHABHAR",
  },
  {
    publicationgroupid: "ZSAG",
    publicationgroupname: "ANMI Journal ",
  },
  {
    publicationgroupid: "sdfghhg455",
    publicationgroupname: "ARASIYAL MALAR",
  },
  {
    publicationgroupid: "ARO KHABAR",
    publicationgroupname: "ARO KHABAR",
  },
  {
    publicationgroupid: "ARYAN AGE",
    publicationgroupname: "ARYAN AGE",
  },
  {
    publicationgroupid: "AV_MAX",
    publicationgroupname: "AV Max",
  },
  {
    publicationgroupid: "AWAZ",
    publicationgroupname: "AWAZ",
  },
  {
    publicationgroupid: "AZAD BARTA",
    publicationgroupname: "AZAD BARTA",
  },
  {
    publicationgroupid: "AAb",
    publicationgroupname: "Aab tak",
  },
  {
    publicationgroupid: "AAB",
    publicationgroupname: "Aabad",
  },
  {
    publicationgroupid: "717",
    publicationgroupname: "Aabar yugantar",
  },
  {
    publicationgroupid: "482",
    publicationgroupname: "Aabshar",
  },
  {
    publicationgroupid: "Aacharan",
    publicationgroupname: "Aacharan",
  },
  {
    publicationgroupid: "Aachran",
    publicationgroupname: "Aachran",
  },
  {
    publicationgroupid: "AadHy",
    publicationgroupname: "Aadab Hyderabad",
  },
  {
    publicationgroupid: "Aadharsh Maharashtra",
    publicationgroupname: "Aadharsh Maharashtra",
  },
  {
    publicationgroupid: "AG",
    publicationgroupname: "Aag",
  },
  {
    publicationgroupid: "AAJG",
    publicationgroupname: "Aaj - Gaya",
  },
  {
    publicationgroupid: "AAJBIKAS",
    publicationgroupname: "Aaj Bikas",
  },
  {
    publicationgroupid: "Aaj Di Awaz",
    publicationgroupname: "Aaj Di Awaz",
  },
  {
    publicationgroupid: "Aaj Ka Aalaap",
    publicationgroupname: "Aaj Ka Aalaap",
  },
  {
    publicationgroupid: "Aaj Ka Bulletin",
    publicationgroupname: "Aaj Ka Bulletin",
  },
  {
    publicationgroupid: "334",
    publicationgroupname: "Aaj Kal",
  },
  {
    publicationgroupid: "AAJSAMAJ",
    publicationgroupname: "Aaj Samaj",
  },
  {
    publicationgroupid: "AAJ",
    publicationgroupname: "Aaj ka Alaap",
  },
  {
    publicationgroupid: "Aaj ka Kanpur",
    publicationgroupname: "Aaj ka Kanpur",
  },
  {
    publicationgroupid: "Aajno Yug",
    publicationgroupname: "Aajno Yug",
  },
  {
    publicationgroupid: "Aalmi Darpan",
    publicationgroupname: "Aalmi Darpan",
  },
  {
    publicationgroupid: "Aa_As",
    publicationgroupname: "Aami Asomor",
  },
  {
    publicationgroupid: "BSCHENNAI",
    publicationgroupname: "Aap Ane",
  },
  {
    publicationgroupid: "AKF",
    publicationgroupname: "Aap Ka Faisla",
  },
  {
    publicationgroupid: "523",
    publicationgroupname: "Aapala Vartahar",
  },
  {
    publicationgroupid: "AAF",
    publicationgroupname: "Aapka Faisla",
  },
  {
    publicationgroupid: "68",
    publicationgroupname: "Aapka Sakshi ",
  },
  {
    publicationgroupid: "ashy",
    publicationgroupname: "Aapla Sanj Sahyadri",
  },
  {
    publicationgroupid: "Aaple Mahanagar",
    publicationgroupname: "Aaple Mahanagar",
  },
  {
    publicationgroupid: "ANS",
    publicationgroupname: "Aaple Nave Shahar",
  },
  {
    publicationgroupid: "AAP",
    publicationgroupname: "Aas Paas ",
  },
  {
    publicationgroupid: "NB",
    publicationgroupname: "Aatma Ki Jawala",
  },
  {
    publicationgroupid: "aakija",
    publicationgroupname: "Aatma ki Jwala ",
  },
  {
    publicationgroupid: "Aa_ne",
    publicationgroupname: "Aawami News",
  },
  {
    publicationgroupid: "668",
    publicationgroupname: "Abhi Abhi",
  },
  {
    publicationgroupid: "Abhiyaan",
    publicationgroupname: "Abhiyaan",
  },
  {
    publicationgroupid: "Abhiyan Times",
    publicationgroupname: "Abhiyan Times",
  },
  {
    publicationgroupid: "AI",
    publicationgroupname: "Absolute India",
  },
  {
    publicationgroupid: "Achik Sambad",
    publicationgroupname: "Achik Sambad",
  },
  {
    publicationgroupid: "Act_In",
    publicationgroupname: "Action India",
  },
  {
    publicationgroupid: "Ac_Ti",
    publicationgroupname: "Active Times",
  },
  {
    publicationgroupid: "ad_ka",
    publicationgroupname: "Adhikar",
  },
  {
    publicationgroupid: "ADSOM",
    publicationgroupname: "Adinor Sombad",
  },
  {
    publicationgroupid: "790",
    publicationgroupname: "Adityaz",
  },
  {
    publicationgroupid: "178",
    publicationgroupname: "Adyar times ",
  },
  {
    publicationgroupid: "AFR",
    publicationgroupname: "Afaqs Reporter ",
  },
  {
    publicationgroupid: "afpo",
    publicationgroupname: "Aftenposten",
  },
  {
    publicationgroupid: "wewcdw",
    publicationgroupname: "Afternoon",
  },
  {
    publicationgroupid: "5",
    publicationgroupname: "Afternoon Despatch & Courier",
  },
  {
    publicationgroupid: "AFTN",
    publicationgroupname: "Afternoon News",
  },
  {
    publicationgroupid: "Afternoon Voice",
    publicationgroupname: "Afternoon Voice",
  },
  {
    publicationgroupid: "aflo",
    publicationgroupname: "Aftonbladet",
  },
  {
    publicationgroupid: "AA_GZ",
    publicationgroupname: "Agaaz",
  },
  {
    publicationgroupid: "Agartala Diary",
    publicationgroupname: "Agartala Diary",
  },
  {
    publicationgroupid: "Agencyfaq.Com",
    publicationgroupname: "Agencyfaq.Com",
  },
  {
    publicationgroupid: "Agni Baan",
    publicationgroupname: "Agni Baan",
  },
  {
    publicationgroupid: "AB",
    publicationgroupname: "Agniban",
  },
  {
    publicationgroupid: "agbha",
    publicationgroupname: "Agra Bharat",
  },
  {
    publicationgroupid: "CHR",
    publicationgroupname: "Agra News",
  },
  {
    publicationgroupid: "AT",
    publicationgroupname: "Agradoot",
  },
  {
    publicationgroupid: "Agrani Varta",
    publicationgroupname: "Agrani Varta",
  },
  {
    publicationgroupid: "Ahinsa Kranti",
    publicationgroupname: "Ahinsa Kranti",
  },
];

const BasketCityPub = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectorCompanies, setSelectorCompanies] = useState([]);
  // const [addNewRoCompany,setAddNewRowCompany] = useState([])
  const [tableData, setTableData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [highlightRows, setHighlightRows] = useState([]);
  const [tableFetchFlag, setTableFetchFalg] = useState(false);

  console.log(highlightRows);
  console.log(tableData);

  //   * data hooks
  const { data: clientData } = useFetchData(`${url}clientlist/`);

  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );
  const { data: cityData } = useFetchData(`${url}citieslist`);

  const fetchCBCPList = async () => {
    setFetchLoading(true);
    try {
      const clientid = "INFINIXIN";
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
      setFetchLoading(false);
    } finally {
      setTableFetchFalg(false);
    }
  };

  useEffect(() => {
    fetchCBCPList();
  }, []);

  useEffect(() => {
    if (tableFetchFlag) {
      fetchCBCPList();
    }
  }, [tableFetchFlag]);

  const handleDeleteRow = async (row) => {
    const userToken = localStorage.getItem("user");
    const request_data = [
      {
        clientid: "INFINIXIN",
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
            width={200}
            setCompanies={setSelectorCompanies}
          />
        </Box>
        <Selector
          cityData={cityData?.data?.cities || []}
          companyData={data?.data?.companies || []}
          publications={publications}
          clientid={selectedClient}
          companies={selectorCompanies}
          setCompanies={setSelectorCompanies}
        />
      </Grid>

      {/* Second section */}
      <Grid item xs={12} sm={8} md={9}>
        <Box display={"flex"} mt={1}>
          <AddNewRow
            cityOptions={cityData?.data?.cities || []}
            companyData={data?.data?.companies || []}
            publicationData={publications}
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

export default BasketCityPub;
