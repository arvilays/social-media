// import { useState, useEffect } from "react";
// import { useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <Feed />
    </div>
  );
}

export default Home;

