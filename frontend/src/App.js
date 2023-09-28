import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar";
import LandingPage from "./components/LandingPage";
import ChatsPage from "./components/ChatsPage";
import io from "socket.io-client";
import { useEffect } from "react";

function App() {
  const socket = io("http://localhost:5000"); // Connect to the server

  //receiving message from server
  // const myFunc = () => {
  //   socket.on("first", (name) => {
  //     console.log(name);
  //   });
  // };

  //sending message to server
  // const myFunc2 = () => {
  //   socket.emit("first", "this is from client to server");
  // };

  // useEffect(() => {
  // }, []);
  return (
    <div className="App">
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
