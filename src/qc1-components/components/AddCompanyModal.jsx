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

const AddCompaniesModal = ({ open, setOpen, selectedRows }) => {
  const [fetchedCompanies, setFetchedCompanies] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const articleIds = selectedRows.map((i) => i.id);

  // * handle close  modal
  const handleClose = () => {
    setFetchedCompanies([]);
    setOpen(false);
  };

  // * company selection
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [addCompanyLoading, setAddCompanyLoading] = useState(false);

  // * fetch tagged companies
  const fetchTaggedCompanies = async () => {
    try {
      setFetchLoading(true);
      const params = {
        article_ids: arrayToString(articleIds),
      };
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url}taggedcompaniesprint/`, {
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
    if (!selectedCompany) {
      toast.warning("Please select company.");
      return;
    }
    try {
      setAddCompanyLoading(true);
      const request_data = {
        article_ids: selectedRows,
        company_id: selectedCompany?.value,
      };
      const userToken = localStorage.getItem("user");
      const response = await axios.post(
        `${url}tagcompanytoarticles/`,
        request_data,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response) {
        toast.success("Company added");
        fetchTaggedCompanies();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddCompanyLoading(false);
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      const userToken = localStorage.getItem("user");
      const company_id = row?.company_id;
      const request_data = {
        article_ids: arrayToString(selectedRows),
        company_id,
      };
      const response = await axios.delete(
        `${url}modifycompanyforprintarticles/`,
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
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
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
    { field: "company", headerName: "Company", width: 150 },
    { field: "article_id", headerName: "Article ID", width: 150 },
    { field: "keyword", headerName: "Keyword", width: 250 },
  ];

  const rows = [];

  fetchedCompanies.forEach((company) => {
    let firstPair = true;
    if (company.keyword_article_pair) {
      company.keyword_article_pair.forEach((pair) => {
        rows.push({
          id: rows.length,
          company: firstPair ? company.company_name : "",
          article_id: pair.article_id,
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
              <DebounceSearchCompany setSelectedCompany={setSelectedCompany} />
            </span>
            <span className="">
              <Button
                onClick={handleAddCompany}
                isLoading={addCompanyLoading}
                btnText={addCompanyLoading ? "adding" : "Add"}
              />
            </span>
          </Box>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
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
};

export default AddCompaniesModal;
