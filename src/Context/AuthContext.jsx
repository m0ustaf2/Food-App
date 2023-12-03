import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";


export let AuthContext = createContext(null);

export default function AuthContextProvider(props) {
  const baseUrl = "https://upskilling-egypt.com:443";
  const [adminData, setAdminData] = useState({});
  

  let saveAdminData = () => {
    let encodedToken = localStorage.getItem("adminToken");
    try {
      let decodedToken = jwtDecode(encodedToken);
      setAdminData(decodedToken);
    } catch (error) {
      setAdminData(null);
    }
  };
let headers={
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  }
let HeadersWithContent={
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    "Content-Type": "multipart/form-data",
  }

  
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      saveAdminData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ adminData, saveAdminData,headers,baseUrl,HeadersWithContent}}>
      {props.children}
    </AuthContext.Provider>
  );
}
