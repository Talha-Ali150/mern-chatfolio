import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar";
import LandingPage from "./components/LandingPage";
import ChatsPage from "./components/ChatsPage";

function App() {
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
