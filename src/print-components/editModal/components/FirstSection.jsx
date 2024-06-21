import PropTypes from "prop-types";
import YesOrNo from "../../../@core/YesOrNo";
import { yesOrNo } from "../../../constants/dataArray";
import FormWithLabelTextField from "../../../@core/FormWithLabel";
import { useEffect, useState } from "react";
import CustomDebounceDropdown from "../../../@core/CustomDebounceDropdown";
import Button from "../../../components/custom/Button";
import axios from "axios";
import { url } from "../../../constants/baseUrl";
import { toast } from "react-toastify";

const FirstSection = (props) => {
  const { classes, selectedArticle } = props;
  const [focusedTextFields, setFocusedTextField] = useState({
    isHeadline: false,
    isSummary: false,
    isArticleSummary: false,
  });
  const articleId = selectedArticle.article_id;
  const [articleHeaderData, setArticleHeaderData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Data states
  const [selectedPublication, setSelectedPublication] = useState("");
  const [headline, setHeadline] = useState("");
  const [journalist, setJournalist] = useState("");
  const [box, setBox] = useState("");
  const [photo, setPhoto] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [pageValue, setPageValue] = useState("");
  const [space, setSpace] = useState("");
  const [qc1By, setQc1By] = useState("");
  const [qc2By, setQc2By] = useState("");
  const [articleSummary, setArticleSummary] = useState("");

  const YesOrNoModifier = (item) => {
    let result = (item === "Y" && "Yes") || (item == "N" && "No");
    return result;
  };

  // * headers
  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };

  const fetchArticleHeader = async () => {
    try {
      const response = await axios.get(
        `${url}articleheader/?article_id=${articleId}`,
        {
          headers,
        }
      );
      const fetchedArticle = response.data.article[0];
      if (fetchedArticle) {
        let boxV = YesOrNoModifier(fetchedArticle.box);
        let photoV = YesOrNoModifier(fetchedArticle.photo);
        setArticleHeaderData(fetchedArticle);
        setHeadline(fetchedArticle.headline);
        setJournalist(fetchedArticle.author);
        setSelectedPublication(fetchedArticle.publication);
        setBox(boxV);
        setPhoto(photoV);
        setPageNumber(fetchedArticle.page_number);
        setPageValue(fetchedArticle.page_value);
        setSpace(fetchedArticle.space);
        setQc1By(fetchedArticle.qc1_by);
        setQc2By(fetchedArticle.qc2_by);
        setArticleSummary(fetchedArticle.head_summary);
      }
    } catch (error) {
      toast.warning("Error while fetch header.");
    }
  };
  // * fetch header data when app load
  useEffect(() => {
    fetchArticleHeader();
  }, [articleId]);

  const updateData = async () => {
    try {
      setUpdateLoading(true);
      const data = {
        ARTICLEID: articleId,
      };
      // Compare each state variable with articleHeaderData
      if (headline !== articleHeaderData?.headline) {
        data.HEADLINES = headline;
      }
      if (journalist !== articleHeaderData?.author) {
        data.JOURNALIST = journalist;
      }
      if (box !== articleHeaderData?.box) {
        data.BOX = box;
      }
      if (photo !== articleHeaderData?.photo) {
        data.PHOTO = photo;
      }
      if (pageNumber !== articleHeaderData?.page_number) {
        data.PAGENUMBER = pageNumber;
      }
      if (pageValue !== articleHeaderData?.page_value) {
        data.PAGEVALUE = pageValue;
      }
      if (selectedPublication !== articleHeaderData?.publication) {
        data.PUBLICATIONNAME = selectedPublication;
      }
      if (space !== articleHeaderData?.space) {
        data.SPACE = space;
      }
      if (articleSummary !== articleHeaderData?.head_summary) {
        data.HEADSUMMARY = articleSummary;
      }
      if (qc1By !== articleHeaderData?.qc1_by) {
        data.QC1BY = qc1By;
      }
      if (qc2By !== articleHeaderData?.qc2_by) {
        data.QC2BY = qc2By;
      }

      const response = await axios.post(`${url}updatearticleheader/`, [data], {
        headers,
      });
      if (response.status === 200) {
        fetchArticleHeader();
        toast.success("Header updated.");
      }
    } catch (error) {
      toast.error("Error while updating.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <form>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center w-full gap-2">
          <label htmlFor="headlines" className="text-[0.9em] text-gray-500">
            Headlines:
          </label>
          <textarea
            id="headlines"
            className="outline-none border border-gray-400 text-[0.9em] rounded-[3px]"
            rows={focusedTextFields.isHeadline ? 3 : 1}
            style={{ width: "100%" }}
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

        <div className="flex items-center w-full gap-2">
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
          <Button
            btnText={updateLoading ? "Updating" : "update"}
            isLoading={updateLoading}
            onClick={updateData}
          />
        </div>
      </div>
    </form>
  );
};

FirstSection.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedArticle: PropTypes.object,
  editedSingleArticle: PropTypes.object,
  setEditedSingleArticle: PropTypes.func.isRequired,
};

export default FirstSection;
