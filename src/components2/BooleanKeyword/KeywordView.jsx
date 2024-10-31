import { useState } from "react";
import {
  Box,
  Modal,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

const english = [
  {
    id: 1,
    text: `Active Drink" OR capsico OR "Dabur Chyawanprash" OR "Real fruit Juice" OR "Dabur amla" OR Chyawanshakti OR "Nature care" OR "Amit Burman" OR "P D Narang" OR Odopic OR Odonil OR lemoneez OR Shakhapushpi OR satisabgol OR "dabur india" OR odomos OR janmaghunti OR meswak OR "promise toothpaste" OR "Lal Dant Manjan" OR "anmol sarson amla" OR "Efarelle comfort" PR itchcare OR Nopane OR "vatika shampoo" OR "Pradip burman" OR "anand Burman" OR "sani fresh" OR Babool OR "Heena conditioning shampoo" OR "pudin hara" OR hajmola OR "sabyna strong" OR dabur OR ++(Dabur)`,
  },
  {
    id: 2,
    text: `"Dabur India" OR (Dabur AND ("Mohit Malhotra" OR "Ankush Jain" OR "Adarsh Sharma" OR "Mohit Burman" OR "Amit Burman" OR "Mayank Kumar" OR "Biplab Baksi" OR "Rahul Awasthi" OR "Swasthya Aur Suraksha" OR "Jivanti"))`,
  },
  {
    id: 3,
    text: `?Dabur India OR Dabur OR "Dabur red" OR "Dabur oral care" OR "Dabur oral" OR "Chawanprash" OR "Real Juices" OR "FEM" OR "Honey" OR "Glucose D" OR "Vatika" OR "Dabur Amla" OR "Dabur Meswak" OR "Babool" OR "Honitus" OR "Odomos" OR "Odomil" OR "Sanifresh" OR "Gulabari" OR "Hommade" OR "Dabur Vedic" OR "Fem" OR "Oxylife"`,
  },
  {
    id: 4,
    text: `(Dabur AND ("Swasthya Aur Suraksha" OR Jivanti OR "Mohit Malhotra" OR "Ankush Jain" OR "Adarsh Sharma" OR "Mohit Burman" OR "Amit Burman" OR "Mayank Kumar" OR "Biplab Baksi" OR "Rahul Awasthi"))`,
  },
];

const hindi = [
  {
    id: 1,
    text: `"ऍक्टिव्ह ड्रिंक" capsico "डाबर च्यवनप्राश" "रिअल फ्रूट ज्यूस" "डाबर आवळा" च्यवनशक्ती "नेचर केअर" "अमित बर्मन" "पी डी नारंग" Odopic Odonil lemoneez शंखपुष्पी satisabgol "डाबर इंडिया" odomos जन्मघुंटी meswak "प्रॉमिस टूथपेस्ट" "लाल दंत मंजन" "अनमोल सरसों आवळा" "Efarelle comfort" PR itchcare Nopane "वाटिका शॅम्पू" "प्रदीप बर्मन" "आनंद बर्मन" "सॅनी फ्रेश" बाबुल "हेना कंडिशनिंग शॅम्पू" "पुदीन हरा" हजमोला "सब्यना स्ट्रॉंग" डाबर ++(डाबर)`,
  },
  {
    id: 2,
    text: `"डाबर इंडिया" (डाबर ("मोहित मल्होत्रा" "अंकुश जैन" "आदर्श शर्मा" "मोहित बर्मन" "अमित बर्मन" "मयंक कुमार" "बिप्लब बक्सी" "राहुल अवस्थी" "स्वास्थ्य और सुरक्षा" "जीवंती"))`,
  },
  {
    id: 3,
    text: `?डाबर इंडिया डाबर "डाबर रेड" "डाबर ओरल केअर" "डाबर ओरल" "च्यवनप्राश" "रिअल ज्यूस" "FEM" "मध" "ग्लुकोज डी" "वाटिका" "डाबर आवळा" "डाबर मेस्वाक" "बाबुल" "होनिटस" "ओडोमोस" "ओडोमिल" "सॅनिफ्रेश" "गुलाबारी" "होममेड" "डाबर वेदिक" "फेम" "ऑक्सीलाइफ"`,
  },
  {
    id: 4,
    text: `(डाबर ("स्वास्थ्य और सुरक्षा" जीवंती "मोहित मल्होत्रा" "अंकुश जैन" "आदर्श शर्मा" "मोहित बर्मन" "अमित बर्मन" "मयंक कुमार" "बिप्लब बक्सी" "राहुल अवस्थी"))`,
  },
];

const KeywordView = ({ open, handleClose }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="keyword-view-modal-title"
      aria-describedby="keyword-view-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          borderRadius: 1,
        }}
      >
        {/* Modal Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontSize={"1em"}>
            Keyword View
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {/* Modal Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="keyword tabs"
        >
          <Tab
            label={
              <Tooltip title="Include Query">
                <AddBoxIcon />
              </Tooltip>
            }
          />
          <Tab
            label={
              <Tooltip title="Exclude Query">
                <DisabledByDefaultIcon />
              </Tooltip>
            }
          />
        </Tabs>
        <Divider />
        {/* Modal Content */}
        <Box mt={1}>
          {tabValue === 0 && (
            <Paper>
              <Typography
                id="keyword-view-modal-description"
                color="GrayText"
                fontSize={"1em"}
                p={1}
              >
                {english.slice(0, 2).map((item) => (
                  <Typography key={item.id} variant="body2" paragraph>
                    <span className="font-bold">English : </span> {item.text}
                  </Typography>
                ))}
                {hindi.slice(0, 2).map((item) => (
                  <Typography key={item.id} variant="body2" paragraph>
                    <span className="font-bold">Marathi : </span> {item.text}
                  </Typography>
                ))}
              </Typography>
            </Paper>
          )}
          {tabValue === 1 && (
            <Paper>
              <Typography
                id="keyword-view-modal-description"
                color="GrayText"
                fontSize={"1em"}
                p={1}
              >
                {/* Render 2 Marathi and 2 English texts */}
                {english.slice(2, 4).map((item) => (
                  <Typography key={item.id} variant="body2" paragraph>
                    <span className="font-bold">English : </span> {item.text}
                  </Typography>
                ))}
                {hindi.slice(2, 4).map((item) => (
                  <Typography key={item.id} variant="body2" paragraph>
                    <span className="font-bold">Marathi : </span> {item.text}
                  </Typography>
                ))}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

KeywordView.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default KeywordView;
