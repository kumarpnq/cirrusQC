import axios from "axios";
import { url } from "../constants/baseUrl";
import { toast } from "react-toastify";

const arrayToString = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map((item) => `'${item}'`).join(",");
  }
  return "";
};

const addPropertyIfConditionIsTrue = (condition, obj, key, value) => {
  if (condition) {
    obj[key] = value;
  }
};

export const handleSearchPrintData = async (
  companies,
  withCategory,
  client,
  fromDate,
  dateNow,
  dateType,
  publicationGroup,
  publication,
  pubType,
  category,
  subject,
  reportingTone,
  prominence,
  qc1Done,
  qc2Done,
  qc1By,
  qc2By,
  city,
  languages,
  userToken,
  setPrintTableData,
  setIsTableDataLoading,
  setTotalRecordsCount,
  pageNumber,
  recordsPerPage,
  setFetchingUsingPrevNext
) => {
  if (!client) {
    toast.warning(`Please select a Client`);
    return;
  }
  setPrintTableData([]);
  try {
    setIsTableDataLoading(true);
    const requestData = {
      client_id: client,
      with_category: withCategory,
      from_date: fromDate,
      to_date: dateNow,
      date_type: dateType,
      items_per_page: recordsPerPage,
      page: pageNumber,
      count: "Y",
    };

    // Adding optional fields conditionally
    addPropertyIfConditionIsTrue(
      companies.length > 0,
      requestData,
      "company_id",
      arrayToString(companies)
    );
    addPropertyIfConditionIsTrue(
      languages.length > 0,
      requestData,
      "languages",
      arrayToString(languages)
    );
    addPropertyIfConditionIsTrue(
      publicationGroup,
      requestData,
      "publication_group",
      publicationGroup
    );
    addPropertyIfConditionIsTrue(
      publication,
      requestData,
      "publication",
      publication
    );
    addPropertyIfConditionIsTrue(pubType, requestData, "pub_type", pubType);
    addPropertyIfConditionIsTrue(category, requestData, "category", category);
    addPropertyIfConditionIsTrue(
      subject,
      requestData,
      "reportingsubject",
      subject
    );
    addPropertyIfConditionIsTrue(
      reportingTone,
      requestData,
      "reportingtone",
      reportingTone
    );
    addPropertyIfConditionIsTrue(
      prominence,
      requestData,
      "prominence",
      prominence
    );
    addPropertyIfConditionIsTrue(qc1Done, requestData, "is_qc1", qc1Done);
    addPropertyIfConditionIsTrue(qc2Done, requestData, "is_qc2", qc2Done);
    addPropertyIfConditionIsTrue(
      qc1By.length > 0 && arrayToString(qc1By),
      requestData,
      "qc1_by",
      arrayToString(qc1By)
    );
    addPropertyIfConditionIsTrue(
      qc2By.length > 0 && arrayToString(qc2By),
      requestData,
      "qc2_by",
      arrayToString(qc2By)
    );
    addPropertyIfConditionIsTrue(
      city.length > 0 && arrayToString(city),
      requestData,
      "city",
      arrayToString(city)
    );

    const headers = {
      Authorization: "Bearer " + userToken,
    };
    const response = await axios.post(
      `${url}listArticlebyQCPrint/`,
      requestData,
      {
        headers,
      }
    );

    if (response?.data?.feed_data) {
      setPrintTableData(response.data.feed_data);
    }
    if (response?.data?.feed_count) {
      const count = response?.data?.feed_count[0].total_rows;
      setTotalRecordsCount(count);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsTableDataLoading(false);
    setFetchingUsingPrevNext(false);
  }
};
