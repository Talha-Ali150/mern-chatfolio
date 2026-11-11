import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar";
import LandingPage from "./components/LandingPage";
import ChatsPage from "./components/ChatsPage";

function App() {
  const token = useSelector((state) => state.user.userInfo?.token);
  return (
    <div className="App">
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={token ? <ChatsPage /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
