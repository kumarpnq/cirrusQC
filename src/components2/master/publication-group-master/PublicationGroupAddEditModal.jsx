import PropTypes from "prop-types";
import { Box, Modal, Button, Typography, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";

const PublicationGroupAddEditModal = ({
  open,
  handleClose,
  row,
  fromWhere,
}) => {
  const [publicationGroupId, setPublicationGroupId] = useState("");
  const [publicationGroupName, setPublicationGroupName] = useState("");
  const [qc3, setQc3] = useState("");
  const [copyright, setCopyright] = useState("");
  const [country, setCountry] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    if (open && row && fromWhere === "Edit") {
      setPublicationGroupId(row?.publicationGroupId || row?.id);
      setPublicationGroupName(row?.publicationGroupName);
      setQc3(row?.qc3 || "");
      setCopyright(row?.copyright || "");
      setCountry(row?.country || "");
      setActive(row?.active || "");
    }
  }, [fromWhere, row, open]);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(row);
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
        <Typography fontSize={"1em"}>{fromWhere} Publication Group</Typography>
        <form
          action=""
          onClick={handleSubmit}
          className="p-1 border rounded-md shadow-md"
        >
          <StyledWrapper>
            <StyledText>ID : </StyledText>
            <CustomTextField
              width={"100%"}
              placeholder={"Publication Group ID"}
              type={"text"}
              value={publicationGroupId}
              setValue={setPublicationGroupId}
            />
          </StyledWrapper>
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
            <CustomTextField
              width={"100%"}
              placeholder={"QC3"}
              type={"text"}
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
            <CustomTextField
              width={"100%"}
              placeholder={"Country"}
              type={"text"}
              value={country}
              setValue={setCountry}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Active : </StyledText>
            <CustomTextField
              width={"100%"}
              placeholder={"Active"}
              type={"text"}
              value={active}
              setValue={setActive}
            />
          </StyledWrapper>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" size="small">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small">
              Save
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
};

export default PublicationGroupAddEditModal;
