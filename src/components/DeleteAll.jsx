import React, { useContext } from "react";
import { handleUseData } from "../appContext/AppContext";

const DeleteAll = ({ handleAllChecked, isChecked, handleAllDeleted }) => {
  let data = handleUseData();
  // console.log(data);
  return (
    <>
      <input
        type="checkbox"
        value={isChecked}
        onChange={(e) => handleAllChecked(e.target.checked)}
      />
      <button onClick={() => handleAllDeleted(isChecked)} type="button">
        DeleteAll
      </button>
    </>
  );
};

export default DeleteAll;
