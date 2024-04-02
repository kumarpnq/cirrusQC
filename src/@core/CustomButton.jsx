import PropTypes from "prop-types";

const CustomButton = ({ onClick, btnText, bg }) => {
  return (
    <button
      className={`flex border border-gray-400 rounded px-10 uppercase text-white mt-3 tracking-wider text-[0.9em] ${
        bg ? bg : ""
      }`}
      onClick={onClick}
    >
      {btnText}
    </button>
  );
};
CustomButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  btnText: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
};

export default CustomButton;
