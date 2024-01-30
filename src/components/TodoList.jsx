import React, { useRef, useState } from "react";

const TodoList = ({
  handleSingleTodoDelete,
  tasks,
  handleTodoUpdate,
  inProgressTasks,
  setState,
}) => {
  const draggingItem = useRef();
  const dragOverItem = useRef();
  const dragStarted = (e, id, i) => {
    e.dataTransfer.setData("todoId", id);
    draggingItem.current = i;
  };
  const draggingOver = (e) => {
    e.preventDefault();
  };
  const dragDrop = (e) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData("taskId");
    const draggableTask = inProgressTasks.find(
      (task) => task.id.toString() === dragId
    );
    if (draggableTask) {
      setState({ type: "dragTodo", data: draggableTask });
      setState({ type: "deleteInProgress", data: draggableTask.id });
    }
  };
  const onDragEnter = (e, id) => {
    dragOverItem.current = id;
  };
  const handleDragEnd = (e) => {
    const listCopy = [...tasks];
    const draggingItemContent = listCopy[draggingItem.current];

    listCopy.splice(draggingItem.current, 1);
    listCopy.splice(dragOverItem.current, 0, draggingItemContent);
    // console.log(listCopy);
    draggingItem.current = null;
    dragOverItem.current = null;

    setState({ type: "todoItemUpDown", data: listCopy });
  };
  return (
    <>
      <div
        droppable
        onDrop={(e) => dragDrop(e)}
        onDragOver={(e) => draggingOver(e)}
        className="h-screen"
      >
        <ul className="mt-5 ">
          {tasks.map((task, i) => (
            <li
              key={i}
              className="active:animate-pulse active:cursor-grab border-y pl-6 py-5 my-2 shadow-md cursor-move mx-3"
              draggable
              onDragStart={(e) => dragStarted(e, task.id, i)}
              onDragEnter={(e) => onDragEnter(e, i)}
              onDragEnd={handleDragEnd}
            >
              <input
                type="checkbox"
                checked={task.checked}
                onChange={(e) => {
                  handleTodoUpdate({ ...task, checked: e.target.checked });
                }}
              />
              <EditTodo handleTodoUpdate={handleTodoUpdate} task={task} />
              <button
                onClick={() => handleSingleTodoDelete(task.id)}
                className="btn ml-2 border border-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;

const EditTodo = ({ task, handleTodoUpdate }) => {
  const [edit, setEdit] = useState(false);

  return (
    <>
      {!edit ? (
        <>
          <span>{task.data}</span>
          <button
            onClick={() => setEdit(!edit)}
            className="btn ml-2 border border-red-500"
          >
            edit
          </button>
        </>
      ) : (
        <>
          <input
            className="border border-gray-500"
            type="text"
            onChange={(e) => {
              handleTodoUpdate({ ...task, data: e.target.value });
            }}
            placeholder="Edit Todo"
            value={task.data}
          />
          <button
            onClick={() => {
              setEdit(!edit);
            }}
            className="btn ml-2 border border-red-500"
          >
            Save
          </button>
        </>
      )}
    </>
  );
};
