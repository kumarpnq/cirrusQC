import PropTypes from "prop-types";
import {
  Box,
  Modal,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import YesOrNo from "../../../@core/YesOrNo";
import CustomSingleSelect from "../../../@core/CustomSingleSelect2";
import { countriesWithCode } from "../../../constants/dataArray";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";

const PublicationGroupAddEditModal = ({
  open,
  handleClose,
  row,
  fromWhere,
  setFetchAfterSave,
}) => {
  const [publicationGroupId, setPublicationGroupId] = useState("");
  const [publicationGroupName, setPublicationGroupName] = useState("");
  const [qc3, setQc3] = useState("");
  const [copyright, setCopyright] = useState("");
  const [country, setCountry] = useState("");
  const [active, setActive] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchSinglePubGroupData = async () => {
    try {
      const response = await axiosInstance.get(
        `singlePubGroupData/?pubGroupId=${row?.pubGroupId}`
      );

      const localRow = response.data.data.data[0] || {};
      setPublicationGroupName(localRow?.pubGroupName);
      setQc3(
        (localRow?.qc3 === "Y" && "Yes") || (localRow?.qc3 === "N" && "No")
      );
      setCopyright(localRow?.copyright || "");
      setCountry(String(localRow?.countryId) || "");
      setActive(
        (localRow?.isActive === "Y" && "Yes") ||
          (localRow?.isActive === "N" && "No")
      );
      setPublicationGroupId(localRow?.pubGroupId);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    if (open && row && fromWhere === "Edit") {
      fetchSinglePubGroupData();
    }
  }, [fromWhere, row, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setUpdateLoading(true);
      const requestData = {
        pubGroupId: publicationGroupId,
      };
      if (fromWhere === "Edit") {
        if (publicationGroupName !== row?.pubGroupName) {
          requestData.pubGroupName = publicationGroupName;
        }
        if ((qc3 === "Yes" ? "Y" : "N") !== row?.qc3) {
          requestData.qc3 = qc3 === "Yes" ? "Y" : "N";
        }
        if (copyright !== row?.copyright) {
          requestData.copyright = copyright;
        }
        if (country !== String(row?.countryId)) {
          requestData.countryId = Number(country);
        }
        if (active !== (row?.isActive === "Y" ? "Yes" : "No")) {
          requestData.isActive = active === "Yes" ? "Y" : "N";
        }
      }

      const data = {
        pubGroupName: publicationGroupName,
        qc3: qc3 === "Yes" ? "Y" : "N",
        copyright: copyright,
        countryId: Number(country),
      };

      if (fromWhere === "Edit" && Object.keys(requestData).length === 1) {
        return;
      }

      if (fromWhere === "Add" && Object.keys(data).length !== 4) {
        return;
      }

      const endpoint =
        fromWhere === "Add"
          ? "addPublicationGroup/"
          : "updatePublicationGroup/";

      const response = await axiosInstance.post(
        endpoint,
        fromWhere === "Edit" ? requestData : data
      );
      if (response.status === 200) {
        toast.success(
          fromWhere === "Edit"
            ? response.data?.data?.message
            : response.data?.response?.message
        );
        setPublicationGroupId("");
        setPublicationGroupName("");
        setQc3("");
        setCopyright("");
        setCountry("");
        setActive("");
        if (fromWhere === "Add") {
          handleClose();
        }
        if (fromWhere === "Edit") {
          fetchSinglePubGroupData();
        }
        setFetchAfterSave(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
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
          width: "50vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          borderRadius: 2,
        }}
      >
        <Typography fontSize={"1em"}>{fromWhere} Publication Group</Typography>

        <form
          onSubmit={handleSubmit}
          className="p-1 border rounded-md shadow-md"
        >
          {fromWhere === "Add" && (
            <p className="text-end text-[0.7em] text-gray-500">
              * All fields are required.
            </p>
          )}

          {fromWhere === "Edit" && (
            <StyledWrapper>
              <StyledText>ID : </StyledText>
              <CustomTextField
                width={"100%"}
                placeholder={"Publication Group ID"}
                type={"text"}
                value={publicationGroupId}
                setValue={setPublicationGroupId}
                isDisabled
              />
            </StyledWrapper>
          )}

          <StyledWrapper>
            <StyledText>Name : </StyledText>
            <CustomTextField
              width={"100%"}
              placeholder={"Publication Group Name"}
              type={"text"}
              value={publicationGroupName}
              setValue={setPublicationGroupName}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>QC3 : </StyledText>
            <YesOrNo
              mapValue={["Yes", "No"]}
              placeholder="QC3"
              // width={"100%"}
              value={qc3}
              setValue={setQc3}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Copyright : </StyledText>
            <CustomTextField
              width={"100%"}
              placeholder={"Copyright"}
              type={"text"}
              value={copyright}
              setValue={setCopyright}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Country : </StyledText>
            <CustomSingleSelect
              dropdownToggleWidth={"100%"}
              dropdownWidth={"100%"}
              keyId="id"
              keyName="name"
              options={countriesWithCode}
              title="Country"
              selectedItem={country}
              setSelectedItem={setCountry}
            />
          </StyledWrapper>
          {screen === "Edit" && (
            <StyledWrapper>
              <StyledText>Active : </StyledText>
              <YesOrNo
                mapValue={["Yes", "No"]}
                placeholder="Is Active"
                // width={"100%"}
                value={active}
                setValue={setActive}
              />
            </StyledWrapper>
          )}

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => {
                setPublicationGroupId("");
                setPublicationGroupName("");
                setQc3("");
                setCopyright("");
                setCountry("");
                setActive("");
                handleClose();
              }}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={updateLoading ? "outlined" : "contained"}
              size="small"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {updateLoading && <CircularProgress size={"1em"} />}
              {fromWhere === "Edit" ? "Update" : "Add"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

PublicationGroupAddEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.object,
  fromWhere: PropTypes.string.isRequired,
  setFetchAfterSave: PropTypes.func,
};

export default PublicationGroupAddEditModal;
