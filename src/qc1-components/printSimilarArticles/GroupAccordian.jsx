import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import Button from "../../components/custom/Button";
import GroupUnGroupModal from "../print/Group&Ungroup";
import { useState } from "react";

const GroupAccordion = ({
  selectedItems,
  setSelectedItems,
  setSelectionModal,
  fetchTableData,
}) => {
  // * grouping modal
  const [openGroupModal, setOpenGroupModal] = useState(false);
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
            <Button btnText="Group" />
            <Button btnText="Un-Group" />
            <Button btnText="Clear" />
          </StyledBox>
        </AccordionDetails>
      </Accordion>
      {/* <GroupUnGroupModal
        openGroupModal={openGroupModal}
        setOpenGroupModal={setOpenGroupModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        groupOrUnGroup="group"
        fetchMainData={fetchTableData}
      /> */}
    </>
  );
};

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
});
export default GroupAccordion;
