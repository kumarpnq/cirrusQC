import { useState } from "react";
import BulkTable from "./bulk-upload/BulkTable";
import UploadSection from "./bulk-upload/UploadSection";
import UploadControl from "./bulk-upload/UploadControl";
import { toast } from "react-toastify";
import ManualAddPopup from "./bulk-upload/ManualAddPopup";

function BulkUpload() {
  const [data, setData] = useState(null);
  const [dataForGrid, setDataForGrid] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleParse = () => {
    if (data) {
      setDataForGrid(data);
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

        <UploadSection setData={setData} />

        <UploadControl onParse={handleParse} onAdd={handleAdd} />
      </div>

      {/* data table */}
      <BulkTable data={dataForGrid} />
      <ManualAddPopup
        open={isPopupOpen}
        onClose={handlePopupClose}
        setData={setDataForGrid}
      />
    </>
  );
}

export default BulkUpload;
