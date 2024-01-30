import React, { useState } from "react";

const CreateTodo = ({ handleInput, handleAddTodo, value }) => {
  return (
    <>
      <input
        onChange={(e) => handleInput(e.target.value)}
        className="border border-gray-500"
        type="text"
        placeholder="create data"
        value={value}
      />
      <button
        onClick={() => {
          handleAddTodo(value);
          //   handleInput("");
        }}
        className=""
      >
        Created
      </button>
    </>
  );
};

export default CreateTodo;
