import { useEffect, useState } from "react";
import BulkTable from "./bulk-upload/BulkTable";
import UploadSection from "./bulk-upload/UploadSection";
import UploadControl from "./bulk-upload/UploadControl";
import { toast } from "react-toastify";
import ManualAddPopup from "./bulk-upload/ManualAddPopup";
import axios from "axios";
import { url } from "../constants/baseUrl";

function BulkUpload() {
  const [data, setData] = useState([]);
  const [dataForGrid, setDataForGrid] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [buttonPermission, setButtonPermission] = useState({
    bypassScrap: false,
  });

  useEffect(() => {
    const fetchButtonPermission = async () => {
      try {
        const token = localStorage.getItem("user");
        const response = await axios.get(
          `${url}buttonspermissions/?screen=manualUpload`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let bypassScrapping = response.data.permission_data[0];
        setButtonPermission({
          bypassScrap: bypassScrapping.manual_upload,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchButtonPermission();
  }, []);

  const handleParse = () => {
    if (data) {
      const parsedData = data.map((item) => ({
        ...item,
        status: "Pending Check",
      }));

      setDataForGrid(parsedData);
    } else {
      toast.warning("No data found.");
      setDataForGrid([]);
    }
  };

  const handleAdd = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-5 border-2 rounded-md shadow-md">
        {/* upload section */}

        <UploadSection setData={setData} setDataForGrid={setDataForGrid} />

        <UploadControl
          onParse={handleParse}
          onAdd={handleAdd}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectionModal={setSelectionModal}
          gridData={dataForGrid}
          setGridData={setDataForGrid}
          buttonPermission={buttonPermission}
        />
      </div>

      {/* data table */}
      <BulkTable
        data={dataForGrid}
        setSelectedRows={setSelectedRows}
        selectionModal={selectionModal}
        setSelectionModal={setSelectionModal}
      />
      <ManualAddPopup
        open={isPopupOpen}
        onClose={handlePopupClose}
        setData={setDataForGrid}
      />
    </>
  );
}

export default BulkUpload;
