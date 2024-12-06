import { useCallback, useState } from "react";
import { Box, Button, CircularProgress, FormControl } from "@mui/material";
import Typography from "@mui/material/Typography";
import CustomMultiSelect from "../@core/CustomMultiSelect";

// * third party imports
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosConfig";

export default function AddNewRow({
  cityOptions,
  companyData,
  publicationData,
  tableData,
  clientId,
  clientData,
  setHighlightRows,
  setTableData,
  clusterData,
  fetchCbCp,
}) {
  const [companies, setCompanies] = useState([]);
  const [city, setCity] = useState([]);
  const [publicationGroups, setPublicationGroups] = useState([]);

  const [addLoading, setAddLoading] = useState(false);

  const handleAddNewRows = useCallback(async () => {
    setAddLoading(true);
    const clientName = clientData.find(
      (i) => i.clientid === clientId
    )?.clientname;

    // Extract selected company names
    const selectedCompanyNames = companies.map((companyId) => {
      const company = companyData.find((item) => item.companyid === companyId);
      return company ? company.companyname : "";
    });

    // Extract selected city names
    const selectedCityNames = city.map((cityId) => {
      const city = cityOptions.find((item) => item.cityid === cityId);
      return city ? city.cityname : "";
    });

    // Extract selected publication group names
    const selectedPublicationGroupNames = publicationGroups.map((groupId) => {
      const group = publicationData.find(
        (item) => item.publicationgroupid === groupId
      );
      return group ? group.publicationgroupname : "";
    });

    // Check for existing rows in tableData
    const existingRows = tableData.filter(
      (row) =>
        selectedCompanyNames.includes(row.companyname) &&
        selectedCityNames.includes(row.cityname) &&
        selectedPublicationGroupNames.includes(row.publicationname)
    );

    const matchedRows = [];

    selectedCompanyNames.forEach((companyName) => {
      selectedCityNames.forEach((cityName) => {
        selectedPublicationGroupNames.forEach((publicationName) => {
          matchedRows.push({
            clientname: clientName,
            companyname: companyName,
            cityname: cityName,
            publicationname: publicationName,
          });
        });
      });
    });

    const dataToSendFiltered = [];

    companies.forEach((companyId) => {
      city.forEach((cityId) => {
        publicationGroups.forEach((publicationId) => {
          // Check if this combination is in existingRows
          const existsInTableData = existingRows.some(
            (row) =>
              row.companyid === companyId &&
              row.cityid === cityId &&
              row.publicationname === publicationId
          );

          if (!existsInTableData) {
            dataToSendFiltered.push({
              clientId,
              companyId,
              cityId: Number(cityId),
              pubGroupId: publicationId,
              isActive: "Y",
            });
          }
        });
      });
    });
    try {
      const response = await axiosInstance.post(
        `addNewCbcp/`,
        dataToSendFiltered
      );
      if (response.status === 200) {
        toast.success(` ${response.data.data.message}`);
        setTableData((prev) => [...dataToSendFiltered, ...prev]);
        setHighlightRows(dataToSendFiltered);
        setAddLoading(false);
        setCompanies([]);
        setCity([]);
        setPublicationGroups([]);
        fetchCbCp();
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setAddLoading(false);
    }
  }, [
    companies,
    city,
    publicationGroups,
    companyData,
    cityOptions,
    publicationData,
    tableData,
    clientId,
    clientData,
    setTableData,
    setHighlightRows,
  ]);

  return (
    <Box>
      <Typography>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // flexWrap: "wrap",
            gap: 1,
          }}
        >
          <CustomMultiSelect
            title="Companies"
            options={companyData}
            selectedItems={companies}
            setSelectedItems={setCompanies}
            keyId="companyid"
            keyName="companyname"
            dropdownWidth={300}
            dropdownToggleWidth={300}
          />
          <CustomMultiSelect
            title="Cities"
            options={cityOptions || []}
            selectedItems={city}
            setSelectedItems={setCity}
            keyId="cityid"
            keyName="cityname"
            dropdownWidth={300}
            dropdownToggleWidth={300}
          />
          <CustomMultiSelect
            title="PubGroups"
            options={publicationData || []}
            selectedItems={publicationGroups}
            setSelectedItems={setPublicationGroups}
            keyId="publicationgroupid"
            keyName="publicationgroupname"
            dropdownWidth={300}
            dropdownToggleWidth={300}
          />

          <Button
            type="submit"
            onClick={handleAddNewRows}
            variant="outlined"
            size="small"
          >
            {addLoading ? <CircularProgress size={"1em"} /> : " Add"}
          </Button>
        </FormControl>
      </Typography>
    </Box>
  );
}

AddNewRow.propTypes = {
  cityOptions: PropTypes.array.isRequired,
  companyData: PropTypes.array.isRequired,
  publicationData: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  clientId: PropTypes.string.isRequired,
  clientData: PropTypes.array.isRequired,
  setHighlightRows: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired,
};
