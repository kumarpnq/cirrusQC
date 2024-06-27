import { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// * third party imports
import axios from "axios";

// * components &  constants
import Client from "../print-components/dropdowns/Client";

import AddNewRow from "../basketCityPub-components/AddNewRow";
import { url } from "../constants/baseUrl";

// * hooks
import useFetchData from "../hooks/useFetchData";

import Selector from "../basketCityPub-components/Selector";
import { DataGrid } from "@mui/x-data-grid";
const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <IconButton color="error" onClick={() => params.row.id}>
        <ClearIcon />
      </IconButton>
    ),
  },
  { field: "clientname", headerName: "Client", width: 200 },
  { field: "companyname", headerName: "Company", width: 200 },
  { field: "cityname", headerName: "City", width: 200 },
  { field: "publicationname", headerName: "Publication", width: 200 },
];

const rows = [
  {
    id: 13,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "Adilabad",
    publicationname: "Ahmedabad Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 14,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "APAC",
    publicationname: "Ahmedabad Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 15,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "APAC",
    publicationname: "Asian Age",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 16,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "APAC",
    publicationname: "Bangalore Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 17,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "ARLINGTONHEIGHTS",
    publicationname: "Ahmedabad Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 18,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "ARLINGTONHEIGHTS",
    publicationname: "Asian Age",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 19,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "ARLINGTONHEIGHTS",
    publicationname: "Bangalore Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 20,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "Adilabad",
    publicationname: "Ahmedabad Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
  {
    id: 21,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "Adilabad",
    publicationname: "Asian Age",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AA",
  },
  {
    id: 22,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW AUTO INDUSTRY",
    cityname: "Adilabad",
    publicationname: "Bangalore Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "Bangalore Mirror",
  },
  {
    id: 23,
    action: "Remove",
    clientname: "1-BMW CURATED",
    companyname: "BMW CARS BIKE COMPETITION",
    cityname: "APAC",
    publicationname: "Ahmedabad Mirror",
    clientid: "BMWCU11",
    companyid: "BMWINDAUT",
    cityid: 203,
    pubgroupid: "AM",
  },
];

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
  const [companies, setCompanies] = useState([]);

  //   * data hooks
  const { data: clientData } = useFetchData(`${url}clientlist/`);

  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );
  const { data: cityData } = useFetchData(`${url}citieslist`);

  const fetchCBCPList = async () => {
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

      console.log(response.data);
    } catch (error) {
      const errorMessage = error.response
        ? `An error has occurred: ${error.response.status}`
        : error.message;
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCBCPList();
  }, []);

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
            setCompanies={setCompanies}
          />
        </Box>
        <Selector
          cityData={cityData?.data?.cities || []}
          companyData={data?.data?.companies || []}
          publications={publications}
          clientid={selectedClient}
        />
      </Grid>

      {/* Second section */}
      <Grid item xs={12} sm={8}>
        <Box display={"flex"} mt={1}>
          <AddNewRow
            cityOptions={cityData?.data?.cities || []}
            companyData={data?.data?.companies || []}
            publicationData={publications}
            tableData={rows}
            clientId={selectedClient}
            clientData={clientData?.data?.clients || []}
          />
          <Button>Save</Button>
        </Box>

        <Box sx={{ height: 560, width: "100%", mt: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            density="compact"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default BasketCityPub;
