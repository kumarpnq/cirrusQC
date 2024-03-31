import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  Checkbox,
  TextField,
} from "@mui/material";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";

import DebounceSearch from "../../dropdowns/DebounceSearch";

const SecondSection = (props) => {
  const { selectedClient, setSelectedClient, selectedArticle } = props;
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [editableTagData, setEditableTagData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);

  const articleId = !!selectedArticle && selectedArticle?.article_id;

  const { data: tagData } = useFetchData(
    `${url}articletagdetails/?article_id=${articleId}`
  );
  const tagDataToMap = tagData?.data?.article_details || [];

  const { data: tones } = useFetchData(`${url}reportingtonelist`);
  const reportingTones = tones?.data?.reportingtones_list || [];

  const [subjects, setSubjects] = useState([]);

  const { data: subjectLists } = useFetchData(`${url}reportingsubjectlist`);
  useEffect(() => {
    if (subjectLists.data) {
      setSubjects(subjectLists.data.reportingsubject_list);
    }
  }, [subjectLists]);

  const { data: categoryLists } = useFetchData(`${url}subcategorylist/`);
  const categories = categoryLists?.data?.subcategory_list || [];

  useEffect(() => {
    setEditableTagData(tagDataToMap);
  }, [tagDataToMap]);

  const handleChange = (index, key, value) => {
    const updatedRow = { ...editableTagData[index], [key]: value };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  const handleHeaderSpaceBlur = (index) => {
    const spaceValue = Math.round(
      editableTagData[index].header_space *
        editableTagData[index].manual_prominence
    );
    const updatedRow = { ...editableTagData[index], space: spaceValue };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  const handleProminenceBlur = (index) => {
    const spaceValue = Math.round(
      editableTagData[index].header_space *
        editableTagData[index].manual_prominence
    );
    const updatedRow = { ...editableTagData[index], space: spaceValue };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  useEffect(() => {
    const changedRows =
      editableTagData.length > 0 &&
      editableTagData.filter((row, index) => {
        const originalRow = tagDataToMap[index];
        if (!originalRow) return false;
        return Object.keys(row).some((key) => row[key] !== originalRow[key]);
      });
    setModifiedRows(changedRows);
  }, [editableTagData, tagDataToMap]);

  console.log(modifiedRows);

  const handleSaveClick = () => {
    // Send editableTagData to backend
    console.log(editableTagData);

    // Reset modifiedRows state
    setModifiedRows([]);
  };
  console.log(editableTagData);
  console.log(articleId);
  // for adding new company in table
  // useEffect(() => {
  //   if (selectedCompany) {
  //     console.log("test");
  //     console.log(selectedCompany.value);
  //     const newRow =
  //       editableTagData.length > 0 ? { ...editableTagData[0] } : {};
  //     newRow.company_name = selectedCompany.label;
  //     newRow.company_id = selectedCompany.value;
  //     setEditableTagData((prev) => [...prev, newRow]);
  //     console.log(newRow);
  //   }
  // }, [selectedCompany, editableTagData]);

  const handleAddCompany = () => {
    if (selectedCompany) {
      console.log("test");
      console.log(selectedCompany.value);
      const newRow =
        editableTagData.length > 0 ? { ...editableTagData[0] } : {};
      newRow.company_name = selectedCompany.label;
      newRow.company_id = selectedCompany.value;
      setEditableTagData((prev) => [...prev, newRow]);
      console.log(newRow);
    }
  };

  return (
    <div className="px-2 mt-2 border border-black">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <DebounceSearch
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />

        <button
          onClick={handleAddCompany}
          className="px-8 py-1 text-white uppercase rounded-md bg-primary"
        >
          Add company
        </button>
        <button
          onClick={handleSaveClick}
          className="px-8 py-1 text-white uppercase rounded-md bg-primary"
        >
          Save
        </button>
      </Box>
      <Typography sx={{ fontSize: "0.9em" }}>
        ClientName: {selectedClient ? selectedClient : "No client selected"}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table sx={{ overflow: "scroll" }} aria-label="simple table">
          <TableHead
            sx={{ position: "sticky", top: 0, zIndex: 50, color: "white" }}
            className="bg-primary"
          >
            <TableRow sx={{ fontSize: "0.9em" }}>
              <TableCell>CompanyName</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">HeaderSpace</TableCell>
              <TableCell align="right">Prominence</TableCell>
              <TableCell align="right">Space</TableCell>
              <TableCell align="right">Tone</TableCell>
              <TableCell align="right">Delete</TableCell>
              <TableCell align="right">SubCategory</TableCell>
              <TableCell align="right">Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editableTagData?.map((row, index) => (
              <TableRow
                key={row.company_id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell sx={{ fontSize: "0.9em" }} size="small">
                  {row.company_name}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: "0.9em" }}>
                  <select
                    value={row.subject}
                    onChange={(e) =>
                      handleChange(index, "subject", e.target.value)
                    }
                    className="border border-black w-28"
                  >
                    {subjects.map((subject, index) => (
                      <option value={subject} key={subject + String(index)}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell align="right">
                  <input
                    className="border border-black outline-none w-14"
                    value={row.header_space}
                    onBlur={() => handleHeaderSpaceBlur(index)}
                    onChange={(e) =>
                      handleChange(index, "header_space", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <input
                    className="border border-black outline-none w-14"
                    value={row.manual_prominence}
                    onBlur={() => handleProminenceBlur(index)}
                    onChange={(e) =>
                      handleChange(index, "manual_prominence", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="right">{row.space}</TableCell>
                <TableCell align="right">
                  <select
                    value={row.tone}
                    onChange={(e) =>
                      handleChange(index, "reporting_tone", e.target.value)
                    }
                    className="border border-black w-28"
                  >
                    {reportingTones.map((tone, index) => (
                      <option
                        value={tone.tonality}
                        key={tone.tonality + String(index)}
                      >
                        {tone.tonality}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell align="right">
                  <Checkbox />
                </TableCell>
                <TableCell align="right">
                  <select
                    value={row.subcategory}
                    onChange={(e) =>
                      handleChange(index, "subcategory", e.target.value)
                    }
                    className="border border-black w-28"
                  >
                    {categories.map((cate, index) => (
                      <option value={cate} key={cate + String(index)}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell align="right">
                  <input
                    type="text"
                    className="border border-black outline-none w-14"
                    value={row.qc2_remark}
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SecondSection;
