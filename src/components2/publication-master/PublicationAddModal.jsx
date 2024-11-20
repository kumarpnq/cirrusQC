import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import axiosInstance from "../../../axiosConfig";
import useFetchMongoData from "../../hooks/useFetchMongoData";
import { toast } from "react-toastify";

const PublicationAddModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    publicationName: "",
    shortPublication: "",
    actualPublication: "",
  });

  const [publicationGroup, setPublicationGroup] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [insertLoading, setInsertLoading] = useState(false);
  const [isAllSatisfied, setIsAllSatisfied] = useState(false);

  const { data } = useFetchData(`${url}citieslist`);
  const cities = data?.data?.cities || [];

  const { data: publicationGroupsData } = useFetchData(
    `${url}publicationgroupsall`
  );

  const publicationGroups =
    publicationGroupsData?.data?.publication_groups || [];

  const { data: stateData } = useFetchMongoData("/getStates");
  const states = stateData?.data || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      formData.publicationName &&
      formData.shortPublication &&
      formData.actualPublication &&
      publicationGroup &&
      city &&
      state
    ) {
      setIsAllSatisfied(true);
    }
  }, [
    city,
    formData.actualPublication,
    formData.publicationName,
    formData.shortPublication,
    publicationGroup,
    state,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAllSatisfied) {
      toast.warning("Please fill all the fields.");
      return;
    }
    try {
      setInsertLoading(true);
      const requestData = {
        pubName: formData.publicationName,
        actualPub: formData.actualPublication,
        shortPub: formData.shortPublication,
        pubGroupId: publicationGroup,
        cityId: city,
        stateId: Number(state),
      };
      const response = await axiosInstance.post("addPublication/", requestData);

      if (response.status === 200) {
        toast.success(response.data.response.status);
        setFormData({
          publicationName: "",
          actualPublication: "",
          shortPublication: "",
        });
        setPublicationGroup("");
        setCity("");
        setState("");
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setInsertLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2} fontSize={"1em"}>
          Add Publication
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 p-1 border rounded-md shadow-md"
        >
          {!isAllSatisfied && (
            <p className="text-end text-[0.6em] text-gray-500">
              *All fields are required
            </p>
          )}
          <TextField
            placeholder="Publication Name"
            name="publicationName"
            value={formData.publicationName}
            onChange={handleChange}
            fullWidth
            size="small"
            autoFocus
            required
          />
          <TextField
            placeholder="Short Publication"
            name="shortPublication"
            value={formData.shortPublication}
            onChange={handleChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            placeholder="Actual Publication"
            name="actualPublication"
            value={formData.actualPublication}
            onChange={handleChange}
            fullWidth
            size="small"
            required
          />
          <CustomSingleSelect
            dropdownWidth={378}
            keyId="publicationgroupid"
            keyName="publicationgroupname"
            options={publicationGroups}
            dropdownToggleWidth={"100%"}
            title="Publication Group"
            selectedItem={publicationGroup}
            setSelectedItem={setPublicationGroup}
            height={40}
          />{" "}
          <CustomSingleSelect
            dropdownWidth={378}
            keyId="cityid"
            keyName="cityname"
            options={cities}
            dropdownToggleWidth={"100%"}
            title="City"
            selectedItem={city}
            setSelectedItem={setCity}
            height={40}
          />
          <CustomSingleSelect
            dropdownWidth={378}
            keyId="stateId"
            keyName="stateName"
            options={states}
            dropdownToggleWidth={"100%"}
            title="State"
            selectedItem={state}
            setSelectedItem={setState}
            height={40}
          />
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleClose} variant="outlined" size="small">
              Cancel
            </Button>
            <Button
              type="submit"
              variant={insertLoading ? "outlined" : "contained"}
              size="small"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {insertLoading && <CircularProgress size={"1em"} />}
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

PublicationAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default PublicationAddModal;
