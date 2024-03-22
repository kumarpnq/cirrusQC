import { useState } from "react";
import Modal from "./popupModal/Modal";

const DeleteTableData = () => {
  const [isPopup, setIsPopup] = useState(false);
  const handleDeletePopup = () => {
    setIsPopup(!isPopup);
  };
  return (
    <div>
      <button
        className="border-gray-400 rounded px-10 mt-3 uppercase tracking-wider text-white shadow-md bg-red-500"
        onClick={handleDeletePopup}
      >
        Delete
      </button>
      {isPopup && <Modal setIsPopup={setIsPopup} isPopup={isPopup} />}
    </div>
  );
};

export default DeleteTableData;
