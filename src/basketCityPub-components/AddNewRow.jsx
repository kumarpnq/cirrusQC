import { Fragment, useCallback, useState } from "react";
import { Button, FormControl } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CustomMultiSelect from "../@core/CustomMultiSelect";

// * third party imports
import PropTypes from "prop-types";
import MatchedRowModal from "./MatchedRowModal";

export default function AddNewRow({
  cityOptions,
  companyData,
  publicationData,
  tableData,
  clientId,
  clientData,
}) {
  const [companies, setCompanies] = useState([]);
  const [city, setCity] = useState([]);
  const [publicationGroups, setPublicationGroups] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);
  // * matched row modal
  const [open, setOpen] = useState(false);

  const isAnySelected =
    companies.length || city.length || publicationGroups.length;

  const handleAddNewRows = useCallback(() => {
    // clientName
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
    setMatchedItems(existingRows);
    if (existingRows.length) {
      setOpen(true);
    }

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
              clientid: clientId,
              companyid: companyId,
              cityid: cityId,
              pubgroupid: publicationId,
              update_type: "I",
            });
          }
        });
      });
    });
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
  ]);

  return (
    <Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={
            <ArrowDownwardIcon sx={{ color: isAnySelected ? "#0a4f7d" : "" }} />
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="text-primary">Add Rows</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
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
                dropdownWidth={200}
                dropdownToggleWidth={200}
              />
              <CustomMultiSelect
                title="Cities"
                options={cityOptions || []}
                selectedItems={city}
                setSelectedItems={setCity}
                keyId="cityid"
                keyName="cityname"
                dropdownWidth={200}
                dropdownToggleWidth={200}
              />
              <CustomMultiSelect
                title="PubGroups"
                options={publicationData || []}
                selectedItems={publicationGroups}
                setSelectedItems={setPublicationGroups}
                keyId="publicationgroupid"
                keyName="publicationgroupname"
                dropdownWidth={200}
                dropdownToggleWidth={200}
              />

              <Button type="submit" onClick={handleAddNewRows}>
                Add
              </Button>
            </FormControl>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <MatchedRowModal
        open={open}
        setOpen={setOpen}
        matchedItems={matchedItems}
        setMatchedItems={setMatchedItems}
      />
    </Fragment>
  );
}

AddNewRow.propTypes = {
  cityOptions: PropTypes.array.isRequired,
  companyData: PropTypes.array.isRequired,
  publicationData: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  clientId: PropTypes.string.isRequired,
  clientData: PropTypes.array.isRequired,
};
