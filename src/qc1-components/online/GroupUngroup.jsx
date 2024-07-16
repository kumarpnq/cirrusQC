import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import ControlCameraOutlined from "@mui/icons-material/ControlCameraOutlined";
import Button from "../../components/custom/Button";

const GroupUnGroupAccordion = ({
  isShowSecondAccordion,
  buttonsPermission,
  groupLoading,
  handleGroupModalOpen,
  unGroupLoading,
  handleClickUnGroupItems,
  setSelectedArticleIds,
  selectedItems,
  setOpenAddCompanies,
  saveLoading,
  handleSaveManualEditedCells,
  stitchLoading,
  setStitchModalOpen,
}) => {
  if (!isShowSecondAccordion) {
    return null;
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Group & Un-Group Articles
      </AccordionSummary>
      <AccordionDetails sx={{ display: "flex", gap: 1 }}>
        {buttonsPermission?.group === "Yes" && (
          <Button
            btnText={groupLoading ? "Loading" : "group"}
            icon={<AttachFileOutlined />}
            onClick={handleGroupModalOpen}
            isLoading={groupLoading}
          />
        )}
        {buttonsPermission?.un_group === "Yes" && (
          <Button
            btnText={unGroupLoading ? "ungrouping" : "ungroup"}
            icon={<ControlCameraOutlined />}
            onClick={handleClickUnGroupItems}
            isLoading={unGroupLoading}
          />
        )}
        {buttonsPermission?.add_and_remove_company === "Yes" && (
          <Button
            btnText="Add & Remove Companies"
            onClick={() => {
              setSelectedArticleIds(selectedItems.map((i) => i.id));
              setOpenAddCompanies(true);
            }}
          />
        )}
        {buttonsPermission?.stitch === "Yes" && (
          <Button
            btnText="Stitch"
            isLoading={stitchLoading}
            onClick={() => setStitchModalOpen(true)}
          />
        )}
        {buttonsPermission?.unstitch === "Yes" && <Button btnText="UnStitch" />}
        {buttonsPermission?.save === "Yes" && (
          <Button
            btnText={saveLoading ? "Saving" : "Save"}
            onClick={handleSaveManualEditedCells}
            isLoading={saveLoading}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

GroupUnGroupAccordion.propTypes = {
  isShowSecondAccordion: PropTypes.bool.isRequired,
  buttonsPermission: PropTypes.object.isRequired,
  groupLoading: PropTypes.bool.isRequired,
  handleGroupModalOpen: PropTypes.func.isRequired,
  unGroupLoading: PropTypes.bool.isRequired,
  handleClickUnGroupItems: PropTypes.func.isRequired,
  setSelectedArticleIds: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setOpenAddCompanies: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  handleSaveManualEditedCells: PropTypes.func.isRequired,
  stitchLoading: PropTypes.bool.isRequired,
  setStitchModalOpen: PropTypes.func.isRequired,
};

export default GroupUnGroupAccordion;
