import PropTypes from "prop-types";
import YesOrNo from "../../../@core/YesOrNo";
import { yesOrNo } from "../../../constants/dataArray";
import FormWithLabelTextField from "../../../@core/FormWithLabel";
import { useEffect, useState } from "react";
import CustomDebounceDropdown from "../../../@core/CustomDebounceDropdown";

const FirstSection = (props) => {
  const { classes, selectedArticle, setEditedSingleArticle } = props;
  const [focusedTextFields, setFocusedTextField] = useState({
    isHeadline: false,
    isSummary: false,
    isArticleSummary: false,
  });
  const [headline, setHeadline] = useState(selectedArticle?.headline);
  const [selectedPublication, setSelectedPublication] = useState(null);

  const [journalist, setJournalist] = useState(selectedArticle?.author);
  const [box, setBox] = useState(selectedArticle?.box);
  const [photo, setPhoto] = useState(selectedArticle?.photo);
  const [pageNumber, setPageNumber] = useState(selectedArticle?.page_number);
  const [pageValue, setPageValue] = useState(selectedArticle?.page_value);
  const [space, setSpace] = useState(selectedArticle?.space);
  const [qc1By, setQc1By] = useState(selectedArticle?.qc1_by);
  const [qc2By, setQc2By] = useState(selectedArticle?.qc2_by);
  const [articleSummary, setArticleSummary] = useState(
    selectedArticle?.head_summary
  );
  useEffect(() => {
    if (selectedArticle) {
      const data = {
        ARTICLEID: selectedArticle.article_id,
        BOX: box ?? selectedArticle?.box,
        PHOTO: photo ?? selectedArticle?.photo,
        PAGENUMBER: pageNumber ?? selectedArticle?.page_number,
        HEADLINES: headline ?? selectedArticle?.headline,
        PAGEVALUE: pageValue ?? selectedArticle?.page_value,
        PUBLICATIONNAME: selectedPublication ?? selectedArticle.publication,
        JOURNALIST: journalist ?? selectedArticle.author,
        SPACE: space ?? selectedArticle.space,
        HEADSUMMARY: articleSummary ?? selectedArticle.head_summary,
        QC1BY: qc1By ?? selectedArticle.qc1_by,
        QC2BY: qc2By ?? selectedArticle.qc2_by,
      };
      const dataForCompare = {
        ARTICLEID: selectedArticle?.article_id,
        BOX: selectedArticle?.box,
        PHOTO: selectedArticle?.photo,
        PAGENUMBER: selectedArticle?.page_number,
        HEADLINES: selectedArticle?.headline,
        PAGEVALUE: selectedArticle?.page_value,
        PUBLICATIONNAME: selectedArticle?.publication,
        JOURNALIST: selectedArticle?.author,
        SPACE: selectedArticle?.space,
        HEADSUMMARY: selectedArticle?.head_summary,
        QC1BY: selectedArticle?.qc1_by,
        QC2BY: selectedArticle?.qc2_by,
      };
      const isEqual = JSON.stringify(data) === JSON.stringify(dataForCompare);

      if (!isEqual) {
        setEditedSingleArticle(data);
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
    // summary,
    setEditedSingleArticle,
  ]);
  return (
    <form>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="headlines" className="text-[0.9em] text-gray-500">
            Headlines:
          </label>
          <textarea
            name=""
            id=""
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            cols="100"
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
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            cols="100"
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
          tClasses={"ml-2"}
        />
        <div className="flex items-center gap-1">
          <label className="text-[0.8em]">Publication:</label>
          <CustomDebounceDropdown
            publicationGroup={selectedPublication}
            setPublicationGroup={setSelectedPublication}
            bg="bg-white"
            m="0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-[0.8em]">Box:</label>
            <div className="ml-10">
              <YesOrNo
                classes={classes}
                placeholder="Box"
                mapValue={yesOrNo}
                value={box}
                setValue={setBox}
                width={100}
              />
            </div>
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
            isDisabled={true}
            tClasses={"ml-5"}
          />
          <FormWithLabelTextField
            label="Qc2 By"
            type="text"
            value={qc2By}
            setValue={setQc2By}
            width={100}
            isDisabled={true}
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
