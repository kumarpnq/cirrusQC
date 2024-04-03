import PropTypes from "prop-types";
import { Box } from "@mui/material";
import PublicationGroup from "../../dropdowns/PublicationGoup";
import YesOrNo from "../../../@core/YesOrNo";
import { yesOrNo } from "../../../constants/dataArray";
import FormWithLabelTextField from "../../../@core/FormWithLabel";
import { useEffect } from "react";

const FirstSection = (props) => {
  const {
    classes,
    selectedArticle,
    selectedPublication,
    setSelectedPublication,
    headline,
    setHeadline,
    journalist,
    setJournalist,
    summary,
    setSummary,
    box,
    setBox,
    photo,
    setPhoto,
    pageNumber,
    setPageNumber,
    pageValue,
    setPageValue,
    space,
    setSpace,
    qc1By,
    setQc1By,
    qc2By,
    setQc2By,
    articleSummary,
    setArticleSummary,
    setEditedSingleArticle,
  } = props;

  useEffect(() => {
    if (selectedArticle) {
      const data = {
        ARTICLEID: selectedArticle.article_id,
        BOX: selectedArticle?.box || box,
        PAHOTO: selectedArticle?.photo || photo,
        PAGENUMBER: selectedArticle?.page_number || pageNumber,
        HEADLINES: selectedArticle?.headline || headline,
        PAGEVALUE: selectedArticle?.page_value || pageValue,
        PUBLICATIONNAME: selectedArticle.publication || selectedPublication,
        SUMMARY: selectedArticle.detail_summary || articleSummary,
        JOURNALIST: selectedArticle.author || journalist,
        SPACE: selectedArticle.space || space,
        HEADSUMMARY: selectedArticle.head_summary || summary,
        QC1BY: selectedArticle.qc1_by || qc1By,
        QC2BY: selectedArticle.qc2_by || qc2By,
      };
      const dataForCompare = {
        ARTICLEID: selectedArticle?.article_id,
        BOX: selectedArticle?.box,
        PAHOTO: selectedArticle?.photo,
        PAGENUMBER: selectedArticle?.page_number,
        HEADLINES: selectedArticle?.headline,
        PAGEVALUE: selectedArticle?.page_value,
        PUBLICATIONNAME: selectedArticle?.publication,
        SUMMARY: selectedArticle?.detail_summary,
        JOURNALIST: selectedArticle?.author,
        SPACE: selectedArticle?.space,
        HEADSUMMARY: selectedArticle?.head_summary,
        QC1BY: selectedArticle?.qc1_by,
        QC2BY: selectedArticle?.qc2_by,
      };
      const isEqual = JSON.stringify(data) === JSON.stringify(dataForCompare);
      if (!isEqual) {
        setEditedSingleArticle([data]);
      }
    }
  }, [
    articleSummary,
    box,
    headline,
    journalist,
    pageNumber,
    pageValue,
    photo,
    selectedPublication,
    qc1By,
    qc2By,
    selectedArticle,
    space,
    summary,
    setEditedSingleArticle,
  ]);
  return (
    <form>
      <Box
        sx={{
          display: "flex",
          items: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <div className="flex items-center gap-2">
          <label className="mt-2 text-[0.8em]">Publication:</label>
          <div className="flex justify-center">
            <PublicationGroup
              classes={classes}
              publicationGroup={selectedPublication}
              setPublicationGroup={setSelectedPublication}
              width={300}
            />
          </div>
        </div>

        <FormWithLabelTextField
          label="Headlines"
          type="text"
          value={selectedArticle?.headline || headline}
          setValue={setHeadline}
          width={300}
        />
        <FormWithLabelTextField
          label="Journalist"
          type="text"
          value={selectedArticle?.author || journalist}
          setValue={setJournalist}
          width={200}
        />
        <FormWithLabelTextField
          label="Summary"
          type="text"
          value={selectedArticle?.head_summary || summary}
          setValue={setSummary}
          width={300}
        />
        <div className="flex items-center gap-2">
          <label className="mt-2 text-[0.8em]">Box:</label>
          <YesOrNo
            classes={classes}
            placeholder="Box"
            mapValue={yesOrNo}
            value={box}
            setValue={setBox}
            width={100}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="mt-2 text-[0.8em]">Photo:</label>
          <YesOrNo
            classes={classes}
            placeholder="Photo"
            mapValue={yesOrNo}
            value={selectedArticle?.photo || photo}
            setValue={setPhoto}
            width={100}
          />
        </div>
        <FormWithLabelTextField
          label="PageNo"
          type="number"
          value={selectedArticle?.page_number || pageNumber}
          setValue={setPageNumber}
          width={100}
        />
        <FormWithLabelTextField
          label="PageValue"
          type="number"
          value={selectedArticle?.page_value || pageValue}
          setValue={setPageValue}
          width={100}
        />
        <FormWithLabelTextField
          label="Space"
          type="number"
          value={selectedArticle?.space || space}
          setValue={setSpace}
          width={100}
        />
        <FormWithLabelTextField
          label="Qc1 By"
          type="text"
          value={selectedArticle?.qc1_by || qc1By}
          setValue={setQc1By}
          width={100}
        />
        <FormWithLabelTextField
          label="Qc2 By"
          type="text"
          value={selectedArticle?.qc2_by || qc2By}
          setValue={setQc2By}
          width={100}
        />
      </Box>
      <Box mt={2}>
        <FormWithLabelTextField
          label="Article Summary"
          type="text"
          value={selectedArticle?.detail_summary || articleSummary}
          setValue={setArticleSummary}
          width={500}
        />
      </Box>
    </form>
  );
};

FirstSection.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedArticle: PropTypes.object,
  selectedPublication: PropTypes.string,
  setSelectedPublication: PropTypes.func.isRequired,
  headline: PropTypes.string,
  setHeadline: PropTypes.func.isRequired,
  journalist: PropTypes.string,
  setJournalist: PropTypes.func.isRequired,
  summary: PropTypes.string,
  setSummary: PropTypes.func.isRequired,
  box: PropTypes.string,
  setBox: PropTypes.func.isRequired,
  photo: PropTypes.string,
  setPhoto: PropTypes.func.isRequired,
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func.isRequired,
  pageValue: PropTypes.number,
  setPageValue: PropTypes.func.isRequired,
  space: PropTypes.number,
  setSpace: PropTypes.func.isRequired,
  qc1By: PropTypes.string,
  setQc1By: PropTypes.func.isRequired,
  qc2By: PropTypes.string,
  setQc2By: PropTypes.func.isRequired,
  articleSummary: PropTypes.string,
  setArticleSummary: PropTypes.func.isRequired,
  editedSingleArticle: PropTypes.object.isRequired,
  setEditedSingleArticle: PropTypes.func.isRequired,
};

export default FirstSection;
