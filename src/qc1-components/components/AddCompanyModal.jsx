import { useEffect, useState } from "react";
import { Modal, Grid, Typography, IconButton, Box } from "@mui/material";
import { DataGrid, GridCloseIcon } from "@mui/x-data-grid";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// * con
import { url } from "../../constants/baseUrl";
import { arrayToString } from "../../utils/arrayToString";
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";
import Button from "../../components/custom/Button";

const AddCompaniesModal = ({
  open,
  setOpen,
  selectedRows,
  screen,
  setSelectionModal,
}) => {
  const [fetchedCompanies, setFetchedCompanies] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const articleIds = selectedRows.map((i) => i.id);
  const socialFeedIds = selectedRows.map((i) => i.social_feed_id);

  // * removing multiple companies
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [removeMultipleLoading, setRemoveMultipleLoading] = useState(false);

  // * handle close  modal
  const handleClose = () => {
    setSelectedRowsForDelete([]);
    setFetchedCompanies([]);
    setOpen(false);
  };

  // * company selection
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [addCompanyLoading, setAddCompanyLoading] = useState(false);

  // * fetch tagged companies
  const fetchTaggedCompanies = async () => {
    try {
      setFetchLoading(true);
      const Ids = screen === "online" ? socialFeedIds : articleIds;
      const paramKey = screen === "online" ? "socialfeed_ids" : "article_ids";
      const params = {
        [paramKey]: arrayToString(Ids),
      };
      const userToken = localStorage.getItem("user");
      const endpoint =
        screen === "online"
          ? "taggedcompaniesonline/"
          : "taggedcompaniesprint/";
      const response = await axios.get(`${url + endpoint}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      setFetchedCompanies(response.data.tagged_companies);
    } catch (error) {
      console.log(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTaggedCompanies();
    }
  }, [open]);

  // * handle add company
  const handleAddCompany = async () => {
    if (!selectedCompanies.length) {
      toast.warning("Please select company.");
      return;
    }
    try {
      setAddCompanyLoading(true);
      const companyIds = selectedCompanies.map((i) => i.value);
      const ids = screen === "online" ? socialFeedIds : articleIds;
      const paramKey = screen === "online" ? "socialfeed_ids" : "article_ids";
      const request_data = {
        [paramKey]: ids,
        company_ids: companyIds,
      };
      const userToken = localStorage.getItem("user");
      const endpoint =
        screen === "online"
          ? "tagcompanytosocialfeeds"
          : "tagcompanytoarticles/";
      const response = await axios.post(`${url + endpoint}`, request_data, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response) {
        toast.success("Company added");
        setSelectionModal([]);
        setSelectedCompanies([]);
        fetchTaggedCompanies();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setAddCompanyLoading(false);
    }
  };
  const handleDeleteRow = async (row) => {
    try {
      const userToken = localStorage.getItem("user");
      const company_id = row?.company_id;
      const paramKey = screen === "online" ? "socialfeed_ids" : "article_ids";
      const ids = screen === "online" ? socialFeedIds : articleIds;
      const request_data = {
        [paramKey]: arrayToString(ids),
        company_id,
        qcType: "QC1",
      };
      const endpoint =
        screen === "online"
          ? "modifycompanyforonlinearticles/"
          : "modifycompanyforprintarticles/";
      const response = await axios.delete(
        `${url + endpoint}`,
        // request_data,
        {
          headers: { Authorization: `Bearer ${userToken}` },
          params: request_data,
        }
      );
      if (response) {
        toast.success("Company removed.");
        fetchTaggedCompanies();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const rows = [];

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 50,
      renderCell: (params) => {
        if (params.row.showAction) {
          return (
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(params.row)}
            >
              <GridCloseIcon />
            </IconButton>
          );
        }
        return null;
      },
    },
    // {
    //   field: "select",
    //   headerName: (
    //     <Checkbox
    //       size="small"
    //       checked={
    //         selectedRowsForDelete.length === rows.length && rows.length > 0
    //       }
    //       indeterminate={
    //         selectedRowsForDelete.length > 0 &&
    //         selectedRowsForDelete.length < rows.length
    //       }
    //       onChange={handleMasterCheckboxChange}
    //       color="primary"
    //     />
    //   ),
    //   width: 100,
    //   renderCell: (params) => {
    //     if (params.row.showAction) {
    //       return (
    //         <Checkbox
    //           size="small"
    //           checked={selectedRowsForDelete.some(
    //             (row) => row.id === params.row.id
    //           )}
    //           onChange={(e) => handleCheckboxChange(e, params.row)}
    //           color="primary"
    //         />
    //       );
    //     }
    //   },
    // },

    { field: "company", headerName: "Company", width: 150 },
    {
      field: "article_id",
      headerName: screen === "online" ? "SocialFeed ID" : "Article ID",
      width: 150,
    },
    { field: "keyword", headerName: "Keyword", width: 250 },
  ];

  fetchedCompanies.forEach((company) => {
    let firstPair = true;
    if (company.keyword_article_pair) {
      company.keyword_article_pair.forEach((pair) => {
        rows.push({
          id: rows.length,
          company: firstPair ? company.company_name : "",
          article_id:
            screen === "online" ? pair.socialfeed_id : pair.article_id,
          keyword: pair.keyword,
          company_id: company.company_id,
          isPairFlag: true,
          showAction: firstPair,
        });
        firstPair = false;
      });
    } else if (company.keyword) {
      rows.push({
        id: rows.length,
        company: company.company_name,
        article_id: null,
        keyword: company.keyword,
        company_id: company.company_id,
        isPairFlag: false,
        showAction: true,
      });
    } else {
      rows.push({
        id: rows.length,
        company: company.company_name,
        article_id: null,
        keyword: null,
        company_id: company.company_id,
        isPairFlag: false,
        showAction: true,
      });
    }
  });

  // handle delete multiple companies
  const removeSelectedCompanies = async () => {
    const userToken = localStorage.getItem("user");
    const endpoint =
      screen === "online" ? "removecompanyonline" : "removecompanyprint";
    const url = url + endpoint;

    try {
      setRemoveMultipleLoading(true);
      const params = {
        socialfeed_ids: "row.social_feed_id",
        company_ids: arrayToString(selectionModel),
        qcType: "QC1",
      };
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        params,
      });
      console.log("Companies removed successfully:", response.data);
    } catch (error) {
      console.error("Error removing companies:", error);
    } finally {
      setRemoveMultipleLoading(false);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            fontSize={"1em"}
            width={"100%"}
            className="flex justify-between px-1 py-2"
          >
            <span> Add Companies</span>
            <IconButton onClick={handleClose}>
              <GridCloseIcon />
            </IconButton>
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
              py: 1,
            }}
          >
            {" "}
            <span className="pt-1">
              <DebounceSearchCompany
                setSelectedCompany={setSelectedCompanies}
                isMultiple
              />
            </span>
            <div className="flex gap-1">
              <Button
                onClick={handleAddCompany}
                isLoading={addCompanyLoading}
                btnText={addCompanyLoading ? "adding" : "Add"}
              />
              {!!selectedRowsForDelete.length && (
                <Button
                  btnText={removeMultipleLoading ? "Removing" : "Remove"}
                  onClick={removeSelectedCompanies}
                  isLoading={removeMultipleLoading}
                  isDanger
                />
              )}
            </div>
          </Box>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              // checkboxSelection
              // onRowSelectionModelChange={handleRowSelection}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              loading={fetchLoading}
            />
          </div>
        </Grid>
      </Modal>
    </div>
  );
};

AddCompaniesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  screen: PropTypes.string.isRequired,
  setSelectionModal: PropTypes.array.isRequired,
};

export default AddCompaniesModal;
