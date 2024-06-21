import { List, ListItem, ListItemText, Input, Box } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

const Test = () => {
  const [companies, setCompanies] = useState(items);
  const [selectedItems, setSelectedItems] = useState(addedItems);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");

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
    <Box className="flex justify-center gap-4 mt-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <List dense sx={{ height: 300, overflow: "scroll", width: "45%" }}>
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
                {filterItems(companies, companySearch).map((company, index) => (
                  <Draggable key={index} draggableId={company} index={index}>
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
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </List>
        <List dense sx={{ height: 300, overflow: "scroll", width: "45%" }}>
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
                    <Draggable key={index} draggableId={item} index={index}>
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
  );
};

export default Test;
