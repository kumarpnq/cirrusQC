import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTextField from "../../@core/CutsomTextField";
import { styled } from "@mui/system";
import Button from "../../components/custom/Button";

const GroupAccordion = ({ headline, setHeadline }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Group & UnGroup
      </AccordionSummary>
      <AccordionDetails>
        <CustomTextField
          value={headline}
          setValue={setHeadline}
          placeholder={"Headline"}
          type={"text"}
        />
        <StyledBox>
          <Button btnText="Group" />
          <Button btnText="Un-Group" />
          <Button btnText="Clear" />
        </StyledBox>
      </AccordionDetails>
    </Accordion>
  );
};

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
});
export default GroupAccordion;
