import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import FromDate from "../components/research-dropdowns/FromDate";
import { Fragment, useState } from "react";
import { formattedDate } from "../constants/dates";
import CustomTextField from "../@core/CutsomTextField";
import Publication from "./sub-components/Publication";
import CustomMultiSelect from "../@core/CustomMultiSelect";

const FilterWrapper = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 3,
});
const StyledButton = styled(Button)({
  height: 28,
});
const Filters = () => {
  const [uploadDate, setUploadDate] = useState(formattedDate);
  const [articleDate, setArticleDate] = useState(formattedDate);
  const [pageNumber, setPageNumber] = useState();
  const [publication, setPublication] = useState("");
  const [copyPublications, setCopyPublications] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    alert("Hey you clicked.");
  };
  return (
    <Fragment>
      <form onSubmit={handleFormSubmit}>
        <FilterWrapper component={Paper}>
          <Tooltip title="Upload Date">
            <div className="ml-2">
              <FromDate fromDate={uploadDate} setFromDate={setUploadDate} />
            </div>
          </Tooltip>
          <Tooltip title="Article Date">
            <div>
              <FromDate fromDate={articleDate} setFromDate={setArticleDate} />
            </div>
          </Tooltip>
          <Typography component={"div"} sx={{ mt: 1.5 }} height={25}>
            <CustomTextField
              placeholder={"Page"}
              type={"number"}
              width={100}
              value={pageNumber}
              setValue={setPageNumber}
            />
          </Typography>
          <Typography component={"div"} sx={{ mt: 0.5 }}>
            <Publication
              label="Publication"
              options={[]}
              selectedValue={publication}
              setSelectedValue={setPublication}
              width={200}
            />
          </Typography>
          <Typography
            component={"div"}
            sx={{ mt: 1.5 }}
            width={200}
            height={25}
          >
            <CustomMultiSelect
              title="Copy Publication"
              dropdownWidth={200}
              dropdownToggleWidth={200}
              keyId="publicationid"
              keyName="publicationname"
              options={[]}
              selectedItems={copyPublications}
              setSelectedItems={setCopyPublications}
            />
          </Typography>
          <Typography component={"div"} sx={{ mt: 1.5 }} width={50} height={25}>
            <StyledButton type="submit" variant="outlined">
              Search
            </StyledButton>
          </Typography>
        </FilterWrapper>
      </form>
    </Fragment>
  );
};

export default Filters;
