import { useState } from "react";
import Delete from "./popupModal/Delete";

const DeleteTableData = () => {
  const [isPopup, setIsPopup] = useState(false);
  const handleDeletePopup = () => {
    setIsPopup(!isPopup);
  };
  return (
    <div>
      <button
        className="px-10 mt-3 tracking-wider text-white uppercase bg-red-500 border-gray-400 rounded shadow-md"
        onClick={handleDeletePopup}
      >
        Delete
      </button>
      {isPopup && <Delete open={open} setOpen={setIsPopup} />}
    </div>
  );
};

export default DeleteTableData;
