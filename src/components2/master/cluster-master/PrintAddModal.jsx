import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  ListItemText,
  TextField,
  ListItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const PrintAddModal = ({ open, handleClose, row, fromWhere }) => {
  const [clusterName, setClusterName] = useState("");
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchPublications, setSearchPublications] = useState("");
  const [searchCities, setSearchCities] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch publication and city data
  const { data: cityData } = useFetchData(`${url}citieslist`);
  const { data: publicationData } = useFetchData(`${url}publicationgroups/`);

  const demoPublications = publicationData?.data?.publication_groups || [];
  const demoCities = cityData?.data?.cities || [];

  // * add update states
  const [initialState, setInitialState] = useState(null);

  const fetchClusterData = async () => {
    try {
      const params = {
        clusterType: "print",
        clusterId: row?.clusterId,
      };
      const response = await axiosInstance.get(`cluster/clusterDetails/`, {
        params,
      });
      let localState = response.data.data.clusterData;
      setInitialState(localState);
      setClusterName(localState.clusterName);

      // Extract publication groups from cities and remove duplicates
      let publicationGroupSet = new Set();
      let localPublicationIds = [];

      localState.publicationList?.forEach((publication) => {
        publication.cities?.forEach((city) => {
          city.publicationGroups.forEach((group) => {
            // Using the pubGroupId and name to ensure uniqueness
            const pubGroupId = group.pubGroupId;
            const pubGroupName = group.name;
            const uniqueKey = `${pubGroupId}-${pubGroupName}`;

            if (!publicationGroupSet.has(uniqueKey)) {
              publicationGroupSet.add(uniqueKey);
              localPublicationIds.push({
                publicationgroupid: pubGroupId,
                publicationgroupname: pubGroupName,
              });
            }
          });
        });
      });

      let localCities = localState.publicationList[0].cities?.map((i) => ({
        cityid: i.cityId, // Accessing the correct cityId property
        cityname: i.cityName,
      }));

      setSelectedCities(localCities || []);
      setSelectedPublications(localPublicationIds || []);
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (fromWhere === "Edit" && row?.clusterId) {
      fetchClusterData();
    }
  }, [fromWhere, row?.clusterId]);

  // Toggle function for publications
  const handleTogglePublication = (publication) => {
    const currentIndex = selectedPublications.findIndex(
      (item) => item.publicationgroupid === publication.publicationgroupid
    );
    const newSelected = [...selectedPublications];

    if (currentIndex === -1) {
      newSelected.push(publication);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPublications(newSelected);
  };

  // Toggle function for cities
  const handleToggleCity = (city) => {
    const currentIndex = selectedCities.findIndex(
      (item) => item.cityid === city.cityid
    );
    const newSelected = [...selectedCities];

    if (currentIndex === -1) {
      newSelected.push(city);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedCities(newSelected);
  };

  // Filter the lists based on search input
  const filteredPublications = demoPublications.filter((item) =>
    item?.publicationgroupname
      ?.toLowerCase()
      ?.includes(searchPublications?.toLowerCase())
  );

  const filteredCities = demoCities.filter((item) =>
    item?.cityname
      .toLowerCase()
      .includes(searchCities?.toString().toLowerCase())
  );

  // Handle add print clusters
  const handleAddPrintClusters = async () => {
    try {
      setLoading(true);
      const preparedPuData = selectedCities.map((city) => {
        const relatedPublications = selectedPublications.map((pub) => ({
          pubGroupId: pub.publicationgroupid,
          name: pub.publicationgroupname,
        }));

        return {
          cityId: city.cityid,
          cityName: city.cityname,
          publicationGroups: relatedPublications,
        };
      });

      const requestData = {
        clusterType: "print",
        clusterName,
        printClusterData: preparedPuData,
      };
      const response = await axiosInstance.post(
        "cluster/createCluster/",
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setSearchCities([]);
        setSearchPublications("");
        setSelectedPublications([]);
        setSelectedCities([]);
        setClusterName("");
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // handle update cluster
  // * update cluster
  const handleUpdateCluster = async () => {
    try {
      setLoading(true);

      // Step 1: Create a request object with only changed fields
      const preparedPuData = selectedCities.map((city) => {
        const relatedPublications = selectedPublications.map((pub) => ({
          pubGroupId: pub.publicationgroupid,
          name: pub.publicationgroupname,
        }));

        return {
          cityId: city.cityid,
          cityName: city.cityname,
          publicationGroups: relatedPublications,
        };
      });
      const requestData = {
        clusterType: "print",
        clusterId: row?.clusterId,
        printClusterData: preparedPuData,
      };

      if (initialState.clusterName !== clusterName) {
        requestData.clusterName = clusterName;
      }

      // Step 5: Send the update request
      const response = await axiosInstance.post(
        `cluster/updateClusterDetails/`,
        requestData
      );

      if (response.status === 200) {
        toast.success(response.data.data.message);
        fetchClusterData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Render the row for publications and cities
  const renderRow = (data, handleToggle, selectedItems, id, name) => {
    const rowRenderer = ({ index, style }) => {
      const item = data[index];
      const labelId = `checkbox-list-label-${item[id]}`;

      return (
        <ListItem
          key={item[id]}
          role={undefined}
          dense
          button
          onClick={() => handleToggle(item)}
          style={style}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={selectedItems.some(
                (selected) => selected[id] === item[id]
              )}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": labelId }}
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={item[name]} />
        </ListItem>
      );
    };

    rowRenderer.displayName = "RowRenderer";
    return rowRenderer;
  };

  // * handle close all
  const handleCloseAll = () => {
    handleClose();
    setClusterName("");
    setInitialState(null);
    setSearchCities("");
    setSelectedPublications([]);
    setSelectedCities([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseAll}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" mb={2}>
          Add Print Cluster
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Cluster Name"
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          sx={{ mb: 0.5 }}
        />
        <Box display="flex" gap={2}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                height: 270,
              }}
            >
              <TextField
                size="small"
                placeholder="Search Publication Groups"
                value={searchPublications}
                onChange={(e) => setSearchPublications(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FixedSizeList
                height={200}
                itemSize={46}
                itemCount={filteredPublications.length}
              >
                {renderRow(
                  filteredPublications,
                  handleTogglePublication,
                  selectedPublications,
                  "publicationgroupid",
                  "publicationgroupname"
                )}
              </FixedSizeList>
            </Box>
          </Box>

          {/* Cities Section */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                height: 270,
              }}
            >
              <TextField
                size="small"
                placeholder="Search Cities"
                value={searchCities}
                onChange={(e) => setSearchCities(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FixedSizeList
                height={200}
                itemSize={46}
                itemCount={filteredCities.length}
              >
                {renderRow(
                  filteredCities,
                  handleToggleCity,
                  selectedCities,
                  "cityid",
                  "cityname"
                )}
              </FixedSizeList>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCloseAll}
            color="primary"
            size="small"
            variant="outlined"
            sx={{ mr: 0.5 }}
          >
            Close
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={
              fromWhere === "Add" ? handleAddPrintClusters : handleUpdateCluster
            }
            sx={{ display: "flex", gap: 1 }}
          >
            {loading && <CircularProgress size={"1em"} />}
            {fromWhere === "Add" ? "Save" : "Edit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

PrintAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PrintAddModal;
