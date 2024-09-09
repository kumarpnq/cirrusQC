// CustomAccordionDetails.jsx

import PropTypes from "prop-types";
import { AccordionDetails, Box } from "@mui/material"; // Assuming you're using MUI for Box
import SearchableDropdown from "../../../components/dropdowns/SearchableDropdown";
import Datetype from "../../../components/research-dropdowns/Datetype";
import FromDate from "../../../components/research-dropdowns/FromDate";
import ToDate from "../../../components/research-dropdowns/ToDate";
import Qc1All from "../../../components/research-dropdowns/Qc1All";
import Qc1By from "../../../components/research-dropdowns/Qc1By";
import Languages from "../../../components/research-dropdowns/Languages";
import Continents from "../../../components/research-dropdowns/Continents";
import Countries from "../../../components/research-dropdowns/Countries";
import CheckboxComp from "../../../components/checkbox/Checkbox";
import Button from "../../../components/custom/Button";
import CustomTextField from "../../../@core/CutsomTextField";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import { formattedDate, formattedNextDay } from "../../../constants/dates";

import useFetchCompanies from "../../../hooks/useFetchCompanies";

const CustomAccordionDetails = ({
  clientData,
  selectedClient,
  setSelectedClient,
  selectedCompanies,
  setSelectedCompanies,
  // companyData,
  classes,
  dateTypes,
  selectedDateType,
  setSelectedDateType,
  fromDate,
  setFromDate,
  dateNow,
  setDateNow,
  isQc1Done,
  setIsQc1Done,
  qc1Array,
  userList,
  qc1By,
  setQc1By,
  selectedLanguages,
  setSelectedLanguages,
  selectedContinents,
  setSelectedContinents,
  countriesByContinent,
  filteredCountries,
  setFilteredCountries,
  continents,
  selectedCountries,
  setSelectedCountries,
  isImage,
  setIsImage,
  isVideo,
  setIsVideo,
  headOrSummary,
  setHeadOrSummary,
  link,
  setLink,
  socialFeedId,
  setSocialFeedId,
  tableDataLoading,
  fetchTableData,
  setTableData,
}) => {
  const companyData = useFetchCompanies(selectedClient);

  const handleClear = () => {
    setSelectedClient("");
    setSelectedCompanies([]);
    setSelectedDateType("article");
    setFromDate(formattedDate);
    setDateNow(formattedNextDay);
    setIsQc1Done(0);
    setQc1By("");
    setSelectedLanguages([]);
    setSelectedContinents([]);
    setSelectedCountries([]);
    setIsImage(0);
    setIsVideo(0);
    setHeadOrSummary("");
    setLink("");
    setSocialFeedId("");
    setTableData([]);
  };
  return (
    <AccordionDetails>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexFlow: "wrap",
          gap: 1,
        }}
      >
        <div className="flex items-center mt-1" style={{ height: 25 }}>
          <SearchableDropdown
            options={clientData?.data?.clients || []}
            testclient={selectedClient}
            setTestClient={setSelectedClient}
            label="Clients"
            width={300}
          />
        </div>
        <div className="mt-3 w-[200px]">
          <CustomMultiSelect
            dropdownToggleWidth={200}
            dropdownWidth={250}
            keyId="companyid"
            keyName="companyname"
            options={companyData || []}
            selectedItems={selectedCompanies}
            setSelectedItems={setSelectedCompanies}
            title="companies"
          />
        </div>
        <Datetype
          classes={classes}
          dateTypes={dateTypes}
          dateType={selectedDateType}
          setDateType={setSelectedDateType}
        />
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
        <Qc1All
          qc1done={isQc1Done}
          setQc1done={setIsQc1Done}
          classes={classes}
          qc1Array={qc1Array}
        />
        <Qc1By
          qcUsersData={userList || []}
          qc1by={qc1By}
          setQc1by={setQc1By}
          classes={classes}
          pageType={"print"}
        />
        <Languages
          language={selectedLanguages}
          setLanguage={setSelectedLanguages}
          classes={classes}
        />
        <Continents
          continent={selectedContinents}
          setContinent={setSelectedContinents}
          countriesByContinent={countriesByContinent}
          setFilteredCountries={setFilteredCountries}
          continents={continents}
          classes={classes}
        />
        <Countries
          country={selectedCountries}
          setCountry={setSelectedCountries}
          classes={classes}
          filteredCountries={filteredCountries}
        />
        <div className="flex flex-wrap items-center" style={{ height: 25 }}>
          <CheckboxComp value={isImage} setValue={setIsImage} label={"Image"} />
          <CheckboxComp value={isVideo} setValue={setIsVideo} label={"Video"} />
        </div>
        <div
          className="flex flex-wrap items-center gap-2 pt-2"
          style={{ height: 25 }}
        >
          <CustomTextField
            width={200}
            placeholder="Summary/Headline"
            type="text"
            value={headOrSummary}
            setValue={setHeadOrSummary}
          />
          <CustomTextField
            width={200}
            placeholder="Link"
            type="text"
            value={link}
            setValue={setLink}
          />
          <CustomTextField
            width={200}
            placeholder={"socialFeedId"}
            type={"number"}
            value={socialFeedId}
            setValue={setSocialFeedId}
          />
        </div>
        <Button
          btnText={tableDataLoading ? "searching" : "search"}
          isLoading={tableDataLoading}
          onClick={fetchTableData}
        />
        <Button btnText="Clear" onClick={handleClear} />
      </Box>
    </AccordionDetails>
  );
};

CustomAccordionDetails.propTypes = {
  clientData: PropTypes.object.isRequired,
  selectedClient: PropTypes.any.isRequired,
  setSelectedClient: PropTypes.func.isRequired,
  selectedCompanies: PropTypes.array.isRequired,
  setSelectedCompanies: PropTypes.func.isRequired,
  companyData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dateTypes: PropTypes.array.isRequired,
  selectedDateType: PropTypes.any.isRequired,
  setSelectedDateType: PropTypes.func.isRequired,
  fromDate: PropTypes.any.isRequired,
  setFromDate: PropTypes.func.isRequired,
  dateNow: PropTypes.any.isRequired,
  setDateNow: PropTypes.func.isRequired,
  isQc1Done: PropTypes.bool.isRequired,
  setIsQc1Done: PropTypes.func.isRequired,
  qc1Array: PropTypes.array.isRequired,
  userList: PropTypes.array.isRequired,
  qc1By: PropTypes.any.isRequired,
  setQc1By: PropTypes.func.isRequired,
  selectedLanguages: PropTypes.array.isRequired,
  setSelectedLanguages: PropTypes.func.isRequired,
  selectedContinents: PropTypes.array.isRequired,
  setSelectedContinents: PropTypes.func.isRequired,
  countriesByContinent: PropTypes.object.isRequired,
  filteredCountries: PropTypes.array.isRequired,
  setFilteredCountries: PropTypes.func.isRequired,
  continents: PropTypes.array.isRequired,
  selectedCountries: PropTypes.array.isRequired,
  setSelectedCountries: PropTypes.func.isRequired,
  isImage: PropTypes.bool.isRequired,
  setIsImage: PropTypes.func.isRequired,
  isVideo: PropTypes.bool.isRequired,
  setIsVideo: PropTypes.func.isRequired,
  headOrSummary: PropTypes.string.isRequired,
  setHeadOrSummary: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  setLink: PropTypes.func.isRequired,
  socialFeedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setSocialFeedId: PropTypes.func.isRequired,
  tableDataLoading: PropTypes.bool.isRequired,
  fetchTableData: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
};

export default CustomAccordionDetails;
