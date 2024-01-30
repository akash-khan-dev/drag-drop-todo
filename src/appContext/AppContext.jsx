import { createContext, useContext } from "react";

const TodoContext = createContext(null);
export const handleUseData = () => useContext(TodoContext);
const AppContext = ({ children }) => {
  return (
    <>
      <TodoContext.Provider value={"akash"}>{children}</TodoContext.Provider>
    </>
  );
};

export default AppContext;
