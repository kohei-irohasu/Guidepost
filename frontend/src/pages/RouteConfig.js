import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GeneralHeader } from "../components/GeneralHeader";
import { Profile } from "./ProfilePage";
import { Login } from  "./LoginPage";
import { SearchResults } from "./SearchResultsPage";
import { CareerStoryDetail } from "./CareerStoryDetailPage";
import { TopPage } from "./TopPage";
import { Page404 } from "./Page404";
import { AuthContext } from "../services/AuthService";
import { Registration } from "./Registration";

export const RouterConfig = () => {
  const {user, logout} = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  };

  return (
    <>
      <GeneralHeader user ={user} onLogout={logoutHandler} />
      <Routes>
        <Route index element={<TopPage />} />
        <Route path="/profile" 
               element={user ? <Profile /> : <Navigate to="/login" />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/searchresults" element={<SearchResults />} /> 
        <Route path="/careerstorydetail" element={<CareerStoryDetail />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}