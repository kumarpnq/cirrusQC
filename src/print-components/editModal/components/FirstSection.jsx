import PropTypes from "prop-types";
import PublicationGroup from "../../dropdowns/PublicationGoup";
import YesOrNo from "../../../@core/YesOrNo";
import { yesOrNo } from "../../../constants/dataArray";
import FormWithLabelTextField from "../../../@core/FormWithLabel";
import { useEffect, useState } from "react";

const FirstSection = (props) => {
  const { classes, selectedArticle, setEditedSingleArticle } = props;
  const [focusedTextFields, setFocusedTextField] = useState({
    isHeadline: false,
    isSummary: false,
    isArticleSummary: false,
  });
  const [headline, setHeadline] = useState(selectedArticle?.headline);
  const [selectedPublication, setSelectedPublication] = useState("");

  const [journalist, setJournalist] = useState(selectedArticle?.author);
  const [summary, setSummary] = useState(selectedArticle?.head_summary);
  const [box, setBox] = useState(0);
  const [photo, setPhoto] = useState(selectedArticle?.photo);
  const [pageNumber, setPageNumber] = useState(selectedArticle?.page_number);
  const [pageValue, setPageValue] = useState(selectedArticle?.page_value);
  const [space, setSpace] = useState(selectedArticle?.space);
  const [qc1By, setQc1By] = useState(selectedArticle?.qc1_by);
  const [qc2By, setQc2By] = useState(selectedArticle?.qc2_by);
  const [articleSummary, setArticleSummary] = useState(
    selectedArticle?.detail_summary
  );
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
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="summary" className="text-[0.9em] text-gray-500">
            Headlines:
          </label>
          <textarea
            name=""
            id=""
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            cols="32"
            rows={focusedTextFields.isHeadline ? 3 : 1}
            onFocus={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isHeadline: true,
              }))
            }
            onBlur={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isHeadline: false,
              }))
            }
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="summary" className="text-[0.9em] text-gray-500">
            Summary:
          </label>
          <textarea
            name=""
            id=""
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            cols="32"
            rows={focusedTextFields.isSummary ? 3 : 1}
            onFocus={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isSummary: true,
              }))
            }
            onBlur={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isSummary: false,
              }))
            }
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="summary" className="text-[0.9em] text-gray-500">
            ArticleSummary:
          </label>
          <textarea
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            cols="72"
            rows={focusedTextFields.isArticleSummary ? 3 : 1}
            onFocus={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isArticleSummary: true,
              }))
            }
            onBlur={() =>
              setFocusedTextField((prevState) => ({
                ...prevState,
                isArticleSummary: false,
              }))
            }
            value={articleSummary}
            onChange={(e) => setArticleSummary(e.target.value)}
          />
        </div>

        <FormWithLabelTextField
          label="Journalist"
          type="text"
          value={journalist}
          setValue={setJournalist}
          width={200}
        />
        <div className="flex items-center gap-1">
          <label className="text-[0.8em]">Publication:</label>
          <PublicationGroup
            classes={classes}
            publicationGroup={selectedPublication}
            setPublicationGroup={setSelectedPublication}
            width={300}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-[0.8em]">Box:</label>
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
            <label className="text-[0.8em]">Photo:</label>
            <YesOrNo
              classes={classes}
              placeholder="Photo"
              mapValue={yesOrNo}
              value={photo}
              setValue={setPhoto}
              width={100}
            />
          </div>
          <FormWithLabelTextField
            label="PageNo"
            type="number"
            value={pageNumber}
            setValue={setPageNumber}
            width={100}
          />
          <FormWithLabelTextField
            label="PageValue"
            type="number"
            value={pageValue}
            setValue={setPageValue}
            width={100}
          />
          <FormWithLabelTextField
            label="Space"
            type="number"
            value={space}
            setValue={setSpace}
            width={100}
          />
          <FormWithLabelTextField
            label="Qc1 By"
            type="text"
            value={qc1By}
            setValue={setQc1By}
            width={100}
          />
          <FormWithLabelTextField
            label="Qc2 By"
            type="text"
            value={qc2By}
            setValue={setQc2By}
            width={100}
          />
        </div>
      </div>
    </form>
  );
};

FirstSection.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedArticle: PropTypes.object,
  setEditedSingleArticle: PropTypes.func.isRequired,
};

export default FirstSection;
