import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import DataGrid from "./DataGrid";

const dummyData = [
  {
    id: 1,
    companyId: "001",
    companyName: "Tech Innovations Ltd.",
    parentCompany: "Global Tech Holdings",
    industry: "Technology",
    shortCompany: "Tech Innov",
    isActive: "yes",
  },
  {
    id: 2,
    companyId: "002",
    companyName: "Health Solutions Inc.",
    parentCompany: "Wellness Group",
    industry: "Healthcare",
    shortCompany: "Health Sol",
    isActive: "yes",
  },
  {
    id: 3,
    companyId: "003",
    companyName: "Eco Energy Corp.",
    parentCompany: "Green Future Enterprises",
    industry: "Energy",
    shortCompany: "Eco Energy",
    isActive: "no",
  },
  {
    id: 4,
    companyId: "004",
    companyName: "FinTech Innovations",
    parentCompany: "Finance World Ltd.",
    industry: "Finance",
    shortCompany: "FinTech Innov",
    isActive: "yes",
  },
  {
    id: 5,
    companyId: "005",
    companyName: "Green Homes Co.",
    parentCompany: "Eco Living Group",
    industry: "Construction",
    shortCompany: "Green Homes",
    isActive: "no",
  },
  {
    id: 6,
    companyId: "006",
    companyName: "NextGen Pharma",
    parentCompany: "Global Health Corp",
    industry: "Pharmaceuticals",
    shortCompany: "NextGen",
    isActive: "yes",
  },
  {
    id: 7,
    companyId: "007",
    companyName: "Digital Media Ltd.",
    parentCompany: "Media World Group",
    industry: "Media",
    shortCompany: "Digital Media",
    isActive: "no",
  },
  {
    id: 8,
    companyId: "008",
    companyName: "Foodies Inc.",
    parentCompany: "Global Foods Ltd.",
    industry: "Food & Beverage",
    shortCompany: "Foodies",
    isActive: "yes",
  },
  {
    id: 9,
    companyId: "009",
    companyName: "Travel Gurus Co.",
    parentCompany: "Adventure Holdings",
    industry: "Travel",
    shortCompany: "Travel Gurus",
    isActive: "no",
  },
  {
    id: 10,
    companyId: "010",
    companyName: "EduTech Solutions",
    parentCompany: "Global Education Ltd.",
    industry: "Education",
    shortCompany: "EduTech",
    isActive: "yes",
  },
];

const CompanyMaster = () => {
  return (
    <Box>
      <SearchFilters />
      <Divider sx={{ my: 1 }} />
      <DataGrid data={dummyData} />
    </Box>
  );
};

export default CompanyMaster;
