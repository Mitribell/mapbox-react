import React from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";

function App() {
  return (
    <div className="md:flex md:flex-row flex-col">
      <Sidebar />
      <Map />      
    </div>
  );
}

export default App;