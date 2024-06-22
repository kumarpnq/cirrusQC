import PropTypes from "prop-types";
import YesOrNo from "../../../@core/YesOrNo";
import { yesOrNo } from "../../../constants/dataArray";
import FormWithLabelTextField from "../../../@core/FormWithLabel";
import { useEffect, useState } from "react";
import Button from "../../../components/custom/Button";
import axios from "axios";
import { url } from "../../../constants/baseUrl";
import { toast } from "react-toastify";
import useFetchData from "../../../hooks/useFetchData";
import CustomSingleSelect from "../../../@core/CustomSingleSelect";

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

  const [publication, setPublication] = useState({
    publicationid: "",
    publicationname: "",
  });
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

  // data hook
  const { data: publicationData } = useFetchData(`${url}publicationslist/`);

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
        setPublication({
          publicationid: "",
          publicationname: fetchedArticle.publication,
        });
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

  const updateData = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);

      const data = {
        ARTICLEID: articleId,
      };

      const updates = {
        HEADLINES: headline !== articleHeaderData?.headline ? headline : null,
        JOURNALIST:
          journalist !== articleHeaderData?.author ? journalist : null,
        BOX:
          (box === "Yes" ? "Y" : "N") !== articleHeaderData?.box ? box : null,
        PHOTO:
          (photo === "Yes" ? "Y" : "N") !== articleHeaderData?.photo
            ? photo
            : null,
        PAGENUMBER:
          pageNumber !== articleHeaderData?.page_number ? pageNumber : null,
        PAGEVALUE:
          pageValue !== articleHeaderData?.page_value ? pageValue : null,
        PUBLICATIONNAME:
          publication.publicationname !== articleHeaderData?.publication
            ? publication.publicationname
            : null,
        SPACE: space !== articleHeaderData?.space ? space : null,
        HEADSUMMARY:
          articleSummary !== articleHeaderData?.head_summary
            ? articleSummary
            : null,
        QC1BY: qc1By !== articleHeaderData?.qc1_by ? qc1By : null,
        QC2BY: qc2By !== articleHeaderData?.qc2_by ? qc2By : null,
      };

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== null) {
          data[key] = updates[key];
        }
      });

      // Check if there's any data to update
      if (Object.keys(data).length === 1) {
        // Only ARTICLEID is present
        toast.warning("No data to save.");
        setUpdateLoading(false);
        return;
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
          <CustomSingleSelect
            options={publicationData?.data?.publications || []}
            label="publication"
            selectedValue={publication}
            setSelectedValue={setPublication}
            width={200}
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
