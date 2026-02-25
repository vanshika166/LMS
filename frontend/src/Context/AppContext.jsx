import { useState } from "react";
import { createContext } from "react";
import axios from "axios";

export const appDataContext = createContext();
const AppContext = ({ children }) => {
  const serverURL = import.meta.env.VITE_SERVER_URL;
  const [notifications, setNotifications] = useState(null);
  const [count, setCount] = useState(null);


  // function to get all notifications:
  const getNotifications = async () => {
    try {
      const result = await axios.post(
        serverURL + "/api/notification/all-notification",
        {},
        { withCredentials: true },
      );
      if (result) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.log("get all notifications error: ", error);
    }
  };

  // function to get count for unread notifications:
  const getCount = async () => {
    try {
      const result = await axios.post(serverURL + "/api/notification/count",{},{ withCredentials: true });
      setCount(result.data.count)
    } catch (error) {
      console.log("get count error:", error);
    }
  };

  const value = {
    serverURL,
    getNotifications,
    notifications,
    getCount,
    count
  };
  return (
    <appDataContext.Provider value={value}>{children}</appDataContext.Provider>
  );
};

export default AppContext;
