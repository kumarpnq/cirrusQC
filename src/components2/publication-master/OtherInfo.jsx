import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import YesOrNo from "../../@core/YesOrNo";
import { useEffect, useState } from "react";
import CustomTextField from "../../@core/CutsomTextField";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import FormAction from "./FormAction";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "1em",
}));

const OtherInfo = ({
  FieldWrapper,
  FieldLabel,
  handleClose,
  publicationId,
  tabValue,
  screen,
}) => {
  const [coverage, setCoverage] = useState("");
  const [publicationScore, setPublicationScore] = useState("");
  const [adRates, setAdRates] = useState("");
  const [tier, setTier] = useState("");
  const [circulation, setCirculation] = useState("");
  // for online only
  const [monthlyTraffic, setMonthlyTraffic] = useState("");
  const [articleReach, setArticleReach] = useState("");
  const [monthlyUniqueVisitors, setMonthlyUniqueVisitors] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [deviceViewSplit, setDeviceViewSplit] = useState("");
  const [rankingIndia, setRankingIndia] = useState("");
  const [rankingIndustry, setRankingIndustry] = useState("");
  const [googleSearch, setGoogleSearch] = useState("");
  const [bingSearch, setBingSearch] = useState("");

  //   * subscription
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //   * priority
  const [publication, setPublication] = useState("");
  const [language, setLanguage] = useState("");
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");

  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // * destructured states
  const [publicationMetricsLocal, setPublicationMetrics] = useState({
    // for both
    publicationScore: null,
    // for print only
    fullCoverage: null,
    adRates: null,
    tier: null,
    circulation: null,
    // for online only
    monthlyTraffic: null,
    articleReach: null,
    monthlyUniqueVisitors: null,
    mediaType: null,
    deviceViewSplit: null,
    rankingIndia: null,
    rankingIndustry: null,
    googleSearch: null,
    bingSearch: null,
  });
  const [subscriptionLocal, setSubscription] = useState({
    type: null,
    startDate: null,
    endDate: null,
  });
  const [priorityLocal, setPriority] = useState({
    publication: null,
    language: null,
    level1: null,
    level2: null,
    level3: null,
  });

  const fetchPublicationData = async () => {
    try {
      setFetchLoading(true);
      const endpoint =
        screen === "print" ? "publicationDetails" : "publicationDetailsOnline";
      const response = await axiosInstance.get(
        `${endpoint}/?publicationId=${publicationId}`
      );
      const data = response.data?.data?.data;

      setPublicationMetrics(data?.publicationMetrics);
      setSubscription(data?.subscription);
      setPriority(data?.priority);

      // * local state update
      setCoverage(data?.publicationMetrics?.fullCoverage ? "Yes" : "No");
      setPublicationScore(data?.publicationMetrics?.publicationScore);
      setAdRates(data?.publicationMetrics?.adRates);
      setTier(data?.publicationMetrics?.tier);
      setCirculation(data?.publicationMetrics?.circulation);
      let localType = data?.subscription?.type.toLowerCase();
      let formattedType =
        localType.charAt(0).toUpperCase() + localType.slice(1);

      setType(formattedType);
      setStartDate(
        format(data?.subscription?.startDate, "yyyy-MM-dd HH:mm:ss")
      );
      setEndDate(format(data?.subscription?.endDate, "yyyy-MM-dd HH:mm:ss"));

      setPublication(data?.priority?.publication);
      setLanguage(data?.priority?.language);
      setLevel1(data?.priority?.level1);
      setLevel2(data?.priority?.level2);
      setLevel3(data?.priority?.level3);

      // *  for online
      if (screen === "online") {
        setMonthlyTraffic(data?.publicationMetrics?.monthlyTraffic);
        setArticleReach(data?.publicationMetrics?.articleReach);
        setMonthlyUniqueVisitors(data?.publicationMetrics?.monthlyTraffic);
        setMediaType(data?.publicationMetrics?.mediaType);
        setDeviceViewSplit(data?.publicationMetrics?.deviceViewSplit);
        setRankingIndia(data?.publicationMetrics?.rankingIndia);
        setRankingIndustry(data?.publicationMetrics?.rankingIndustry);
        setGoogleSearch(data?.publicationMetrics?.googleSearch);
        setBingSearch(data?.publicationMetrics?.bingSearch);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  };
  useEffect(() => {
    if (tabValue && publicationId) {
      fetchPublicationData();
    }
  }, [publicationId, tabValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setUpdateLoading(true);
      const requestData = {
        publicationId,
      };
      const publicationMetrics = {};
      const subscription = {};
      const priority = {};

      if (screen === "print") {
        if ((coverage === "Yes") !== publicationMetricsLocal?.fullCoverage) {
          publicationMetrics.fullCoverage = coverage === "Yes";
        }
        if (adRates !== publicationMetricsLocal?.adRates) {
          publicationMetrics.adRates = coverage;
        }
        if (tier !== publicationMetricsLocal?.tier) {
          publicationMetrics.tier = tier;
        }
        if (circulation !== publicationMetricsLocal?.circulation) {
          publicationMetrics.circulation = circulation;
        }
      }
      // combine
      if (publicationScore !== publicationMetricsLocal?.publicationScore) {
        publicationMetrics.publicationScore = publicationScore;
      }

      // for online only
      if (screen === "online") {
        if (
          monthlyTraffic !== Math.round(publicationMetricsLocal?.monthlyTraffic)
        ) {
          publicationMetrics.monthlyTraffic = monthlyTraffic;
        }
        if (
          articleReach !== Math.round(publicationMetricsLocal?.articleReach)
        ) {
          publicationMetrics.articleReach = articleReach;
        }
        if (
          monthlyTraffic !== Math.round(publicationMetricsLocal?.monthlyTraffic)
        ) {
          publicationMetrics.monthlyTraffic = monthlyTraffic;
        }
        if (
          monthlyUniqueVisitors !==
          Math.round(publicationMetricsLocal?.monthlyUniqueVisitors)
        ) {
          publicationMetrics.monthlyUniqueVisitors = monthlyUniqueVisitors;
        }
        if (mediaType !== publicationMetricsLocal?.mediaType) {
          publicationMetrics.mediaType = mediaType;
        }
        if (deviceViewSplit !== publicationMetricsLocal?.deviceViewSplit) {
          publicationMetrics.deviceViewSplit = deviceViewSplit;
        }
        if (
          rankingIndia !== Math.round(publicationMetricsLocal?.rankingIndia)
        ) {
          publicationMetrics.rankingIndia = rankingIndia;
        }
        if (
          rankingIndustry !==
          Math.round(publicationMetricsLocal?.rankingIndustry)
        ) {
          publicationMetrics.rankingIndustry = rankingIndustry;
        }
        if (googleSearch !== publicationMetricsLocal?.googleSearch) {
          publicationMetrics.googleSearch = googleSearch;
        }
        if (bingSearch !== publicationMetricsLocal?.bingSearch) {
          publicationMetrics.bingSearch = bingSearch;
        }
      }

      // * Subscription
      let localTypeCase = screen === "print" ? type : type.toUpperCase();
      if (localTypeCase !== subscriptionLocal?.type) {
        let localTypeCheck = screen === "print" ? type : type.toUpperCase();
        subscription.type = localTypeCheck;
      }
      if (
        startDate !==
        format(subscriptionLocal?.startDate, "yyyy-MM-dd HH:mm:ss")
      ) {
        subscription.startDate = startDate;
      }
      if (
        endDate !== format(subscriptionLocal?.endDate, "yyyy-MM-dd HH:mm:ss")
      ) {
        subscription.endDate = endDate;
      }

      // * priority
      if (publication !== priorityLocal?.publication) {
        priority.publication = publication;
      }
      if (language !== priorityLocal?.language) {
        priority.language = language;
      }
      if (level1 !== priorityLocal?.level1) {
        priority.level1 = level1;
      }
      if (level2 !== priorityLocal?.level2) {
        priority.level2 = level2;
      }
      if (level3 !== priorityLocal?.level3) {
        priority.level3 = level3;
      }

      if (Object.keys(publicationMetrics).length) {
        requestData.publicationMetrics = publicationMetrics;
      }
      if (Object.keys(subscription).length) {
        requestData.subscription = subscription;
      }
      if (screen === "print") {
        if (Object.keys(priority).length) {
          requestData.priority = priority;
        }
      }
      if (Object.keys(requestData).length === 1) {
        toast.warning("No data to save.");
        return;
      }
      const endpoint =
        screen === "print"
          ? "updatePublicationDetails"
          : "updateOnlinePublicationDetails";
      const response = await axiosInstance.post(`${endpoint}/`, requestData);
      if (response.status === 200) {
        toast.success(response.data.data?.status);
        setPublicationMetrics(null);
        setSubscription(null);
        setPriority(null);
        fetchPublicationData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <form className="p-1 border rounded-md" onSubmit={handleSubmit}>
      {fetchLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box>
            <StyledTypography>Metrics</StyledTypography>
            <FieldWrapper>
              <FieldLabel>Publication Score : </FieldLabel>
              <CustomTextField
                width={"100%"}
                type={"number"}
                placeholder={"Publication Score"}
                value={publicationScore}
                setValue={setPublicationScore}
              />
            </FieldWrapper>
            {screen === "print" ? (
              <>
                {" "}
                <FieldWrapper>
                  <FieldLabel>Full Coverage : </FieldLabel>
                  <YesOrNo
                    //   width={"100%"}
                    mapValue={["Yes", "No"]}
                    placeholder="Coverage"
                    value={coverage}
                    setValue={setCoverage}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Ad Rates : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Ad Rates"}
                    value={adRates}
                    setValue={setAdRates}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Tier : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Tier"}
                    value={tier}
                    setValue={setTier}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Circulation : </FieldLabel>

                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Circulation"}
                    value={circulation}
                    setValue={setCirculation}
                  />
                </FieldWrapper>
              </>
            ) : (
              <>
                <FieldWrapper>
                  <FieldLabel>Monthly Traffic : </FieldLabel>
                  <TextField
                    InputProps={{
                      style: {
                        fontSize: "0.8rem",
                        height: 25,
                      },
                    }}
                    fullWidth
                    placeholder={"Monthly Traffic"}
                    step="0.01"
                    value={monthlyTraffic}
                    type="number"
                    onChange={(e) => setMonthlyTraffic(e.target.value)}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Article Reach : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"text"}
                    placeholder={"Reach"}
                    value={articleReach}
                    setValue={setArticleReach}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Monthly Unique : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"text"}
                    placeholder={"Visitors"}
                    value={monthlyUniqueVisitors}
                    setValue={setMonthlyUniqueVisitors}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Media Type : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"text"}
                    placeholder={"Media Type"}
                    value={mediaType}
                    setValue={setMediaType}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Device View : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"text"}
                    placeholder={"Device View"}
                    value={deviceViewSplit}
                    setValue={setDeviceViewSplit}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Ranking India : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Ranking India"}
                    value={rankingIndia}
                    setValue={setRankingIndia}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Ranking Industry : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Ranking Industry"}
                    value={rankingIndustry}
                    setValue={setRankingIndia}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Google Search : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Google Search"}
                    value={googleSearch}
                    setValue={setGoogleSearch}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Bing Search : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Bing Search"}
                    value={bingSearch}
                    setValue={setBingSearch}
                  />
                </FieldWrapper>
              </>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box>
            <StyledTypography>Subscription</StyledTypography>
            <FieldWrapper>
              <FieldLabel>Type : </FieldLabel>
              <YesOrNo
                mapValue={["Vendor"]}
                placeholder="Type"
                value={type}
                setValue={setType}
              />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>Start Date : </FieldLabel>
              <TextField
                type="datetime-local"
                InputProps={{ style: { height: 25 } }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>End Date : </FieldLabel>
              <TextField
                type="datetime-local"
                InputProps={{ style: { height: 25 } }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </FieldWrapper>
          </Box>
          {screen === "print" && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box>
                <StyledTypography>Priority</StyledTypography>
                <FieldWrapper>
                  <FieldLabel>Publication : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Publication"}
                    value={publication}
                    setValue={setPublication}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Language : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Language"}
                    value={language}
                    setValue={setLanguage}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Level 1 : </FieldLabel>
                  <CustomTextField
                    width={"100&"}
                    type={"number"}
                    placeholder={"Level 1"}
                    value={level1}
                    setValue={setLevel1}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Level 2 : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Level 2"}
                    value={level2}
                    setValue={setLevel2}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Level 3 : </FieldLabel>
                  <CustomTextField
                    width={"100%"}
                    type={"number"}
                    placeholder={"Level 3"}
                    value={level3}
                    setValue={setLevel3}
                  />
                </FieldWrapper>
              </Box>
            </>
          )}
        </>
      )}

      <Divider sx={{ my: 1 }} />
      <FormAction handleClose={handleClose} updateLoading={updateLoading} />
    </form>
  );
};

OtherInfo.propTypes = {
  FieldWrapper: PropTypes.elementType.isRequired,
  FieldLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
    .isRequired,
  handleClose: PropTypes.func,
  publicationId: PropTypes.string.isRequired,
  tabValue: PropTypes.number.isRequired,
  screen: PropTypes.string,
};

export default OtherInfo;
