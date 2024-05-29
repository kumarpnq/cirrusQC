import { useContext, useState, useRef, useEffect } from "react";
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import axios from "axios";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { debounce } from "lodash";
import PropTypes from "prop-types";

const CustomDebounceDropdown = ({
  publicationGroup,
  setPublicationGroup,
  bg,
  m,
}) => {
  const [isShowList, setIsShowList] = useState(false);
  const [value, setValue] = useState("");
  const [publicationGroups, setPublicationGroups] = useState([]);
  const [pubTitleForShow, setPubTitleForShow] = useState("");
  const [isFirstFetch, setIsFirstFetch] = useState(false);
  const { userToken } = useContext(ResearchContext);
  const headers = { Authorization: `Bearer ${userToken}` };
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsShowList(false);
    }
  };

  const fetchData = async (query) => {
    try {
      let response;
      if (query) {
        const queryResponse = await axios.get(`${url}publicationgroups/`, {
          headers,
          params: { search_term: query },
        });
        response = queryResponse;
      }

      setPublicationGroups(response.data.publication_groups);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (value < 3 || isFirstFetch) {
      const headers = { Authorization: `Bearer ${userToken}` };
      const fetchDataOnLoad = async () => {
        const response = await axios.get(`${url}publicationgroups/`, {
          headers,
        });
        setPublicationGroups(response.data.publication_groups);
        setIsFirstFetch(false);
      };
      fetchDataOnLoad();
    }
  }, [value, userToken, isFirstFetch]);
  const debouncedFetchData = debounce(fetchData, 500);

  const handleSearchTermChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue.length >= 3) {
      debouncedFetchData(newValue);
    } else {
      setIsFirstFetch(true);
    }
  };

  const handleMenuItemClick = (id) => {
    if (publicationGroup === id) return setPublicationGroup("");
    setPublicationGroup(id);
  };

  useEffect(() => {
    const title = publicationGroups.find(
      (i) => i.publicationgroupid === publicationGroup
    );
    setPubTitleForShow(title && title?.publicationgroupname);
  }, [publicationGroup, publicationGroups]);

  return (
    <div ref={dropdownRef} className={`relative ${m}`}>
      <div className="relative">
        <div
          onClick={() => setIsShowList(true)}
          className={`outline-none border border-gray-400 rounded-[3px] h-[18] px-2 py-[2px] placeholder-black placeholder-opacity-75 placeholder-italic text-sm  hover:border-black w-[200px] ${bg}`}
        >
          {pubTitleForShow ? (
            pubTitleForShow
          ) : (
            <p className="italic text-[0.9em]">Publication Group</p>
          )}
        </div>
        <span
          className="absolute text-lg text-gray-500 cursor-pointer right-2 top-1"
          onClick={() => setIsShowList(!isShowList)}
        >
          {isShowList ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
      </div>
      {isShowList && (
        <ul className=" w-[200px] h-[200px] absolute bg-white z-30 shadow-lg rounded-md overflow-y-scroll">
          <li className="sticky top-0">
            <input
              type="text"
              className="outline-none border border-gray-400 rounded-[3px] bg-secondory h-[18] px-2 py-[2px] placeholder-black placeholder-opacity-75 placeholder-italic text-sm  hover:border-black"
              placeholder="Type here for search"
              value={value}
              onChange={handleSearchTermChange}
            />
          </li>
          <li
            className="italic text-gray-400 text-[0.8em] ml-1 cursor-pointer"
            onClick={() => {
              setPublicationGroup(null);
              setPubTitleForShow("");
            }}
          >
            Publication group
          </li>
          {publicationGroups.map((item) => (
            <li
              className={`cursor-pointer text-[0.9em] flex items-center justify-start ml-3 py-1 ${
                item.publicationgroupid === publicationGroup
                  ? "bg-[#e6faf9]"
                  : " "
              }`}
              key={item.publicationgroupid}
              onClick={() => handleMenuItemClick(item.publicationgroupid)}
            >
              {item.publicationgroupname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomDebounceDropdown.propTypes = {
  publicationGroup: PropTypes.string.isRequired,
  setPublicationGroup: PropTypes.func.isRequired,
  bg: PropTypes.string.isRequired,
  m: PropTypes.string.isRequired,
};

export default CustomDebounceDropdown;
