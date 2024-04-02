import PropTypes from "prop-types";

export default function Button({ btnText, onClick, isLoading, icon }) {
  return (
    <button
      className={`flex border border-gray-400 rounded px-10 uppercase text-white mt-3 tracking-wider text-[0.9em] bg-primary ${
        isLoading && "text-yellow-300"
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {icon}
      {btnText}
    </button>
  );
}

Button.propTypes = {
  btnText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  icon: PropTypes.element,
};
