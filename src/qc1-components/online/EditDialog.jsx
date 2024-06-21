import {
  Box,
  Card,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "../../@core/TextFieldWithLabel";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { GridSearchIcon } from "@mui/x-data-grid";
import { url } from "../../constants/baseUrl";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99vw",
  height: "99vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 1,
};

const titleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const items = [
  "{NO Company}",
  "&TV",
  "10MINUTESTO1.COM NCML",
  "12% CLUB",
  "2020 MSL KIA MOTORS (INDUSTRY)",
  "2020 MSL WHATSAPP COMPETITION",
  "22FEET TRIBAL WORLDWIDE",
  "22KYMCO",
  "22MOTORS",
  "321 FOUNDATION",
  "35 NORTH VENTURES LLP",
  "3COM",
  "3I GROUP",
  "3I INFOTECH",
  "3I PRIVATE EQUITY",
];

const addedItems = [
  "CIRRUS SUMMARY",
  "CATEGORY ECONOMY SLICED(+ PM $$2)",
  "CATEGORY ECONOMY(+ PM $$2)",
];

const EditDialog = ({ open, setOpen }) => {
  const [formItems, setFormItems] = useState({
    headline: "test headline",
    summary: "test Summary",
    journalist: "Sidd S",
    page: 5,
    articleSummary: "Article summary",
  });

  const [companies, setCompanies] = useState(items);
  const [selectedItems, setSelectedItems] = useState(addedItems);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const list =
        source.droppableId === "companies"
          ? [...companies]
          : [...selectedItems];
      const [movedItem] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedItem);

      if (source.droppableId === "companies") {
        setCompanies(list);
      } else {
        setSelectedItems(list);
      }
    } else {
      const sourceList =
        source.droppableId === "companies"
          ? [...companies]
          : [...selectedItems];
      const destList =
        destination.droppableId === "companies"
          ? [...companies]
          : [...selectedItems];
      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      setCompanies(source.droppableId === "companies" ? sourceList : destList);
      setSelectedItems(
        source.droppableId === "selectedItems" ? sourceList : destList
      );
    }
  };

  const filterItems = (items, searchQuery) => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
    >
      <Box sx={style}>
        <Box sx={titleStyle}>
          <Typography
            id="edit-dialog-title"
            variant="h6"
            component="h6"
            fontSize={"1em"}
          >
            Edit
          </Typography>
          <Typography id="edit-dialog-description" component={"div"}>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                id="headline"
                name="headline"
                label="Headline"
                value={formItems.headline}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                id="summary"
                name="summary"
                label="Summary"
                value={formItems.summary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                id="journalist"
                name="journalist"
                label="Journalist"
                value={formItems.journalist}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                id="page"
                name="page"
                label="Page"
                type="number"
                value={formItems.page}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                id="articleSummary"
                name="articleSummary"
                label="Article Summary"
                value={formItems.articleSummary}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Typography
            component={"div"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Tooltip title="close">
              <IconButton>
                <ClearIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="save">
              <IconButton>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Paper sx={{ padding: 2 }}>
            <Box className="flex justify-center gap-4 mt-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <List
                  dense
                  sx={{ height: 300, overflow: "scroll", width: "45%" }}
                >
                  <ListItem>
                    <Input
                      startAdornment={<GridSearchIcon />}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      placeholder="Search Companies"
                      sx={{ width: "100%" }}
                    />
                  </ListItem>
                  <Droppable droppableId="companies">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {filterItems(companies, companySearch).map(
                          (company, index) => (
                            <Draggable
                              key={index}
                              draggableId={company}
                              index={index}
                            >
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  button
                                  sx={{ fontSize: "0.9em" }}
                                >
                                  <ListItemText primary={company} />
                                </ListItem>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </List>
                <List
                  dense
                  sx={{ height: 300, overflow: "scroll", width: "45%" }}
                >
                  <ListItem>
                    <Input
                      startAdornment={<GridSearchIcon />}
                      onChange={(e) => setSelectedSearch(e.target.value)}
                      placeholder="Search Selected"
                      sx={{ width: "100%" }}
                    />
                  </ListItem>
                  <Droppable droppableId="selectedItems">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {filterItems(selectedItems, selectedSearch).map(
                          (item, index) => (
                            <Draggable
                              key={index}
                              draggableId={item}
                              index={index}
                            >
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  button
                                  sx={{ fontSize: "0.9em" }}
                                >
                                  <ListItemText primary={item} />
                                </ListItem>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </List>
              </DragDropContext>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <IconButton>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton>
                <NavigateNextIcon />
              </IconButton>
              <IconButton>
                <KeyboardDoubleArrowLeftIcon />
              </IconButton>
              <IconButton>
                <KeyboardDoubleArrowRightIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
        <Card sx={{ mt: 1 }}>
          <iframe
            title="PDF Viewer"
            src={`${url}readArticleFile/?article_id=225563945&file_type=pdf`}
            className="w-screen h-[800px]"
          />
        </Card>
      </Box>
    </Modal>
  );
};

export default EditDialog;
