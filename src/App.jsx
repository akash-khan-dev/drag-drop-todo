import { useReducer, useRef, useState } from "react";
import CreateTodo from "./components/CreateTodo";
import DeleteAll from "./components/DeleteAll";
import TodoList from "./components/TodoList";

function App() {
  const draggingItem = useRef();
  const dragOverItem = useRef();
  const todoFunc = (state, action) => {
    switch (action.type) {
      case "addTodo": {
        return {
          ...state,
          todoArr: [...state.todoArr, action.data],
        };
      }
      case "deleteTodo": {
        return {
          ...state,
          todoArr: state.todoArr.filter((todo) => todo.id !== action.data),
        };
      }
      case "updateTodo": {
        return {
          ...state,
          todoArr: state.todoArr.map((todo) => {
            if (todo.id == action.data.id) {
              return action.data;
            } else {
              return todo;
            }
          }),
        };
      }
      case "allChecked": {
        return {
          ...state,
          checked: action.checked,
          todoArr: state.todoArr.map((data) => {
            return { ...data, checked: action.checked };
          }),
        };
      }
      case "DeleteAll": {
        return {
          ...state,
          todoArr: state.todoArr.filter((data) => data.checked != true),
        };
      }
      case "createTodo": {
        return { ...state, input: action.data };
      }
      case "inProgress": {
        return {
          ...state,
          inProgressTasks: [...state.inProgressTasks, action.data],
        };
      }
      case "dragTodo": {
        return {
          ...state,
          todoArr: [...state.todoArr, action.data],
        };
      }
      case "deleteInProgress": {
        return {
          ...state,
          inProgressTasks: state.inProgressTasks.filter(
            (task) => task.id !== action.data
          ),
        };
      }
      case "todoItemUpDown": {
        return {
          ...state,
          todoArr: action.data,
        };
      }
      case "InprogressUpToDown": {
        return {
          ...state,
          inProgressTasks: action.data,
        };
      }
      default:
        return {
          ...state,
          error: new Error("system error"),
        };
    }
  };
  const allData = {
    todoArr: [
      {
        id: 1,
        data: "One",
        checked: true,
      },
    ],
    inProgressTasks: [],
    input: "",
    checked: true,
    error: null,
  };
  const [state, setState] = useReducer(todoFunc, allData);

  const handleAddTodo = (data) => {
    let todoId = state.todoArr.length + 1;
    setState({
      type: "addTodo",
      data: {
        id: todoId++,
        data: data,
        checked: true,
      },
    });
  };
  const handleSingleTodoDelete = (id) => {
    setState({ type: "deleteTodo", data: id });
  };
  const handleTodoUpdate = (data) => {
    setState({ type: "updateTodo", data: data });
  };
  const handleAllChecked = (data) => {
    setState({ type: "allChecked", checked: data });
  };

  const handleAllDeleted = (data) => {
    setState({ type: "DeleteAll", checked: data });
  };
  const handleInput = (data) => {
    setState({ type: "createTodo", data: data });
  };
  const dragStarted = (e, id, i) => {
    e.dataTransfer.setData("taskId", id);
    draggingItem.current = i;
  };
  const draggingOver = (e) => {
    e.preventDefault();
    console.log("DragOver");
  };
  const dragDrop = (e) => {
    e.preventDefault();
    let todoId = e.dataTransfer.getData("todoId");
    let draggedTask = state.todoArr.find(
      (task) => task.id.toString() === todoId
    );
    if (draggedTask) {
      setState({ type: "deleteTodo", data: draggedTask.id });
      setState({ type: "inProgress", data: draggedTask });
    }
  };
  const onDragEnter = (e, i) => {
    dragOverItem.current = i;
  };

  const DragEnd = () => {
    const listCopy = [...state.inProgressTasks];
    const draggingItemContent = listCopy[draggingItem.current];

    listCopy.splice(draggingItem.current, 1);
    listCopy.splice(dragOverItem.current, 0, draggingItemContent);
    // console.log(listCopy);
    draggingItem.current = null;
    dragOverItem.current = null;
    setState({ type: "InprogressUpToDown", data: listCopy });
  };
  return (
    <>
      {state.error ? (
        <h1>Case note match</h1>
      ) : (
        <div className="container mx-auto">
          <div>
            <DeleteAll
              isChecked={state.checked}
              handleAllChecked={handleAllChecked}
              handleAllDeleted={handleAllDeleted}
            />
          </div>
          <br />
          <div>
            <div className="border-b">
              <CreateTodo
                draggingOver={draggingOver}
                dragDrop={dragDrop}
                handleInput={handleInput}
                value={state.input}
                handleAddTodo={handleAddTodo}
              />
            </div>
            <div className="flex">
              <div className="w-[20%] h-screen border-x border-red-500">
                <h1 className="border-b ">TODO</h1>
                <div className="">
                  <TodoList
                    setState={setState}
                    inProgressTasks={state.inProgressTasks}
                    handleTodoUpdate={handleTodoUpdate}
                    handleSingleTodoDelete={handleSingleTodoDelete}
                    tasks={state.todoArr}
                  />
                </div>
              </div>
              <div
                droppable
                onDragOver={(e) => draggingOver(e)}
                onDrop={(e) => dragDrop(e)}
                className="w-[20%] h-screen border-x border-red-500"
              >
                <h2 className="border-b ">In Progress</h2>
                <div>
                  <ul>
                    {state.inProgressTasks.map((task, i) => (
                      <li
                        draggable
                        onDragStart={(e) => dragStarted(e, task.id, i)}
                        onDragEnter={(e) => onDragEnter(e, i)}
                        onDragEnd={DragEnd}
                        key={i}
                        className="border-y pl-6 py-5 my-2 shadow-md cursor-move mx-3"
                      >
                        {/* <input type="checkbox" checked={task.checked} /> */}
                        <span>{task.data}</span>
                        {/* <button
                          // onClick={() => handleSingleTodoDelete(task.id)}
                          className="btn ml-2 border border-red-500"
                        >
                          Delete
                        </button> */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
