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
import Company from "../../../print-components/dropdowns/Company";
import Category from "../../../print-components/dropdowns/Category";
import FromDate from "../../../components/research-dropdowns/FromDate";
import ToDate from "../../../components/research-dropdowns/ToDate";
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

const SearchFilters = ({
  classes,
  selectedClient,
  setSelectedClient,
  setSelectedCompanies,
  companyData,
  selectedCompanies,
  withCategory,
  setWithCategory,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  uploadDate,
  setUploadDate,
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
  articleType,
  setArticleType,
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
          width={200}
          setCompanies={setSelectedCompanies}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Company
          companyData={companyData}
          companies={selectedCompanies}
          setCompanies={setSelectedCompanies}
          isMt={true}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <Category
          category={withCategory}
          setCategory={setWithCategory}
          classes={classes}
          width={150}
        />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
      </Typography>
      <Typography component={"div"} className={classes.componentHeight}>
        <FromDate fromDate={uploadDate} setFromDate={setUploadDate} />
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
          mapValue={["Print", "Internet", "All"]}
          placeholder="ArticleType"
          value={articleType}
          setValue={setArticleType}
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
          type={"number"}
          width={100}
          value={articleId}
          setValue={setArticleId}
        />
        <CustomTextField
          placeholder={"SystemArticleId"}
          type={"number"}
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
  fromDate: PropTypes.instanceOf(Date).isRequired,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.instanceOf(Date).isRequired,
  setToDate: PropTypes.func.isRequired,
  uploadDate: PropTypes.instanceOf(Date).isRequired,
  setUploadDate: PropTypes.func.isRequired,
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
  articleType: PropTypes.string.isRequired,
  setArticleType: PropTypes.func.isRequired,
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
