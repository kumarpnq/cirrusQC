import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

// * components
import Client from "../../../print-components/dropdowns/Client";
import Category from "../../../print-components/dropdowns/Category";
import CustomDebounceDropdown from "../../../@core/CustomDebounceDropdown";
import Publication from "../../../print-components/dropdowns/Publication";
import PubType from "../../../print-components/dropdowns/PubType";
import Qc1All from "../../../components/research-dropdowns/Qc1All";
import Qc1By from "../../../components/research-dropdowns/Qc1By";
import Cities from "../../../print-components/dropdowns/Cities";
import Languages from "../../../components/research-dropdowns/Languages";
import YesOrNo from "../../../@core/YesOrNo";
import CustomTextField from "../../../@core/CutsomTextField";
import Button from "../../../components/custom/Button";
import SearchableCategory from "../../../components/research-dropdowns/table-dropdowns/SearchableCategory";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";

const SearchFilters = ({
  classes,
  selectedClient,
  setSelectedClient,
  setSelectedCompanies,
  companyData,
  selectedCompanies,
  withCategory,
  setWithCategory,
  category,
  setCategory,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  uploadFromDate,
  setUploadFromDate,
  uploadToDate,
  setUploadToDate,
  publicationGroup,
  setPublicationGroup,
  publication,
  setPublication,
  pubType,
  setPubType,
  qc1Done,
  setQc1Done,
  qc1Array,
  qcUserData,
  qc1By,
  setQc1By,
  selectedCity,
  setSelectedCity,
  selectedLanguages,
  setSelectedLanguages,
  photo,
  setPhoto,
  graph,
  setGraph,
  stitched,
  setStitched,
  tv,
  setTv,
  isNoCompany,
  setIsNoCompany,
  articleId,
  setArticleId,
  systemArticleId,
  setSystemArticleId,
  pageNumber,
  setPageNumber,
  searchKeyword,
  setSearchKeyword,
  gridDataLoading,
  fetchListArticleByQC1Print,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Typography
        component={"div"}
        className={classes.componentHeight}
        sx={{ pt: 1 }}
      >
        <Client
          label="Client"
          client={selectedClient}
          setClient={setSelectedClient}
          width={300}
          setCompanies={setSelectedCompanies}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <div className="mt-3 w-[200px]">
          <CustomMultiSelect
            dropdownToggleWidth={200}
            dropdownWidth={250}
            keyId="companyid"
            keyName="companyname"
            options={companyData}
            selectedItems={selectedCompanies}
            setSelectedItems={setSelectedCompanies}
            title="companies"
          />
        </div>
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Category
          category={withCategory}
          setCategory={setWithCategory}
          classes={classes}
          width={150}
        />
      </Typography>
      <Typography
        component={"div"}
        className={classes.componentHeight}
        sx={{ pt: 0.7 }}
      >
        <SearchableCategory
          label="Category"
          setCategory={setCategory}
          category={category}
          width={150}
          endpoint="categorylist"
        />
      </Typography>
      <Typography
        component={"div"}
        className={`${classes.componentHeight} pt-3`}
      >
        <div className="flex border text-[0.8em] px-2 border-gray-400 rounded-[3px] h-6">
          <label htmlFor="upload-date" className="mr-2">
            Article Date :
          </label>
          <input
            className="outline-none"
            type="date"
            id="dateTimeInput"
            name="dateTimeInput"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className="px-2">To</span>
          <input
            className="outline-none"
            type="date"
            id="dateTimeInput"
            name="dateTimeInput"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </Typography>

      <Typography component={"div"} className={classes.componentHeight}>
        <Cities
          classes={classes}
          city={selectedCity}
          setCity={setSelectedCity}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Languages
          language={selectedLanguages}
          setLanguage={setSelectedLanguages}
          classes={classes}
        />
      </Typography>
      <Typography
        component={"div"}
        className={`${classes.componentHeight} pt-3`}
      >
        <div className="flex border text-[0.8em] px-2 border-gray-400 rounded-[3px] h-6">
          <label htmlFor="upload-date" className="mr-2">
            Upload Date :
          </label>
          <input
            className="outline-none"
            type="date"
            id="dateTimeInput"
            name="dateTimeInput"
            value={uploadFromDate}
            onChange={(e) => setUploadFromDate(e.target.value)}
          />
          <span className="px-2">To</span>
          <input
            className="outline-none"
            type="date"
            id="dateTimeInput"
            name="dateTimeInput"
            value={uploadToDate}
            onChange={(e) => setUploadToDate(e.target.value)}
          />
        </div>
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <CustomDebounceDropdown
          publicationGroup={publicationGroup}
          setPublicationGroup={setPublicationGroup}
          bg="secondory"
          m="mt-3"
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Publication
          publicationGroup={publicationGroup}
          publication={publication}
          setPublication={setPublication}
          classes={classes}
          width={150}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <PubType
          pubType={pubType}
          setPubType={setPubType}
          classes={classes}
          width={150}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Qc1All
          qc1done={qc1Done}
          setQc1done={setQc1Done}
          classes={classes}
          qc1Array={qc1Array}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Qc1By
          qcUsersData={qcUserData}
          qc1by={qc1By}
          setQc1by={setQc1By}
          classes={classes}
          pageType={"print"}
        />
      </Typography>

      <Typography component={"div"} className={classes.componentHeight}>
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Photo"
          value={photo}
          setValue={setPhoto}
          width={100}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Graph"
          value={graph}
          setValue={setGraph}
          width={100}
        />
      </Typography>

      <Typography component={"div"} className={classes.componentHeight}>
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Stitch"
          value={stitched}
          setValue={setStitched}
          width={100}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="TV"
          value={tv}
          setValue={setTv}
          width={100}
        />
      </Typography>
      <Typography
        component={"div"}
        className={classes.componentHeight}
        sx={{ pt: 1 }}
      >
        <FormGroup>
          <FormControlLabel
            label={
              <Typography variant="h6" fontSize={"0.9em"}>
                No company
              </Typography>
            }
            control={
              <Checkbox
                size="small"
                checked={isNoCompany}
                onChange={() => setIsNoCompany((prev) => !prev)}
              />
            }
          />
        </FormGroup>
      </Typography>

      <Typography
        component={"div"}
        className={classes.componentHeight}
        sx={{ gap: 1, pt: 1 }}
      >
        <CustomTextField
          placeholder={"ArticleId"}
          type={"text"}
          width={100}
          value={articleId}
          setValue={setArticleId}
        />
        <CustomTextField
          placeholder={"SystemId"}
          // type={"number"}
          width={100}
          value={systemArticleId}
          setValue={setSystemArticleId}
        />
        <CustomTextField
          placeholder={"PageNumber"}
          type={"number"}
          width={100}
          value={pageNumber}
          setValue={setPageNumber}
        />
        <CustomTextField
          placeholder={"Search Keyword"}
          type={"text"}
          width={200}
          value={searchKeyword}
          setValue={setSearchKeyword}
        />
      </Typography>

      <Typography component={"div"} className={classes.componentHeight}>
        <Button
          btnText={gridDataLoading ? "Searching" : "Search"}
          onClick={fetchListArticleByQC1Print}
          isLoading={gridDataLoading}
        />
      </Typography>
    </Box>
  );
};

SearchFilters.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedClient: PropTypes.string.isRequired,
  setSelectedClient: PropTypes.func.isRequired,
  setSelectedCompanies: PropTypes.func.isRequired,
  companyData: PropTypes.array.isRequired,
  selectedCompanies: PropTypes.array.isRequired,
  withCategory: PropTypes.bool.isRequired,
  setWithCategory: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  fromDate: PropTypes.instanceOf(Date).isRequired,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.instanceOf(Date).isRequired,
  setToDate: PropTypes.func.isRequired,
  uploadFromDate: PropTypes.instanceOf(Date).isRequired,
  setUploadFromDate: PropTypes.func.isRequired,
  uploadToDate: PropTypes.instanceOf(Date).isRequired,
  setUploadToDate: PropTypes.func.isRequired,
  publicationGroup: PropTypes.string.isRequired,
  setPublicationGroup: PropTypes.func.isRequired,
  publication: PropTypes.string.isRequired,
  setPublication: PropTypes.func.isRequired,
  pubType: PropTypes.string.isRequired,
  setPubType: PropTypes.func.isRequired,
  qc1Done: PropTypes.bool.isRequired,
  setQc1Done: PropTypes.func.isRequired,
  qc1Array: PropTypes.array.isRequired,
  qcUserData: PropTypes.array.isRequired,
  qc1By: PropTypes.string.isRequired,
  setQc1By: PropTypes.func.isRequired,
  selectedCity: PropTypes.string.isRequired,
  setSelectedCity: PropTypes.func.isRequired,
  selectedLanguages: PropTypes.array.isRequired,
  setSelectedLanguages: PropTypes.func.isRequired,
  photo: PropTypes.string.isRequired,
  setPhoto: PropTypes.func.isRequired,
  graph: PropTypes.string.isRequired,
  setGraph: PropTypes.func.isRequired,
  stitched: PropTypes.string.isRequired,
  setStitched: PropTypes.func.isRequired,
  tv: PropTypes.string.isRequired,
  setTv: PropTypes.func.isRequired,
  isNoCompany: PropTypes.bool.isRequired,
  setIsNoCompany: PropTypes.func.isRequired,
  articleId: PropTypes.number.isRequired,
  setArticleId: PropTypes.func.isRequired,
  systemArticleId: PropTypes.number.isRequired,
  setSystemArticleId: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  setSearchKeyword: PropTypes.func.isRequired,
  gridDataLoading: PropTypes.bool.isRequired,
  fetchListArticleByQC1Print: PropTypes.func.isRequired,
};

export default SearchFilters;
