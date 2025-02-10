import { createContext, useContext, useState } from "react";

// Create the auth context with an initial value of null for user
const authContext = createContext();

const ContextProvider = ({ children }) => {
  // State to store user data
  const [user, setUser] = useState(null);
  const loginUser = (user) => {
    setUser(user)
  }

  return (
    // Pass the user and setUser function in the provider's value
    <authContext.Provider value={{ user, loginUser }}>
      {children} {/* Render the children passed to this provider */}
    </authContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(authContext);

export default ContextProvider;
