import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import Button from "../../components/custom/Button";
import GroupUnGroupModal from "../print/Group&Ungroup";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../constants/baseUrl";

const GroupAccordion = ({
  selectedItems,
  setSelectedItems,
  setSelectionModal,
  setFetchAfterGroup,
}) => {
  // * grouping modal
  const [openGroupModal, setOpenGroupModal] = useState(false);

  // * un-group selected items
  const [unGroupLoading, setUnGroupLoading] = useState(false);
  const handleUnGroup = async () => {
    if (selectedItems.length !== 1) {
      return toast.warning("Please select exactly one item");
    }
    const parent_id = selectedItems[0]?.article_id;
    try {
      setUnGroupLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = { Authorization: `Bearer ${userToken}` };

      const request_data = {
        parent_id: parent_id,
      };
      const response = await axios.delete(`${url}ungroupsimilarsocialfeeds/`, {
        headers,
        params: request_data,
      });
      if (response.data) {
        toast.success("Articles ungrouped successfully.");
        setSelectedItems([]);
        setSelectionModal([]);
        setFetchAfterGroup(true);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUnGroupLoading(false);
    }
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Group & UnGroup
        </AccordionSummary>
        <AccordionDetails>
          <StyledBox>
            <Button btnText="Group" onClick={() => setOpenGroupModal(true)} />
            <Button
              btnText={unGroupLoading ? "loading" : "Un-Group"}
              isLoading={unGroupLoading}
              onClick={handleUnGroup}
            />
            <Button btnText="Clear" />
          </StyledBox>
        </AccordionDetails>
      </Accordion>
      <GroupUnGroupModal
        openGroupModal={openGroupModal}
        setOpenGroupModal={setOpenGroupModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        groupOrUnGroup="group"
        // fetchMainData={fetchTableData}
        setFetchAfterGroup={setFetchAfterGroup}
      />
    </>
  );
};

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
});
GroupAccordion.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  setFetchAfterGroup: PropTypes.func.isRequired,
};
export default GroupAccordion;
