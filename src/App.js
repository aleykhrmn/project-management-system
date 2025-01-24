import React from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router'ı import ediyoruz
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";

import Login from "./pages/Login"; // Login sayfasını import et
import Register from "./pages/Register"; // Register sayfasını import et
import Team from "./pages/Team";
import ProjectsPage from "./pages/ProjectsPage"; // Projeler sayfası
import AdminPanel from "./pages/AdminPanel";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <Router>
      {" "}
      {/* Router ile yönlendirme işlemlerini başlatıyoruz */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            height: "100vh", // Sayfanın yüksekliğini ekran yüksekliğiyle sınırlıyoruz
            overflow: "hidden", // Kaydırma çubuğunu kaldırıyoruz
          }}
        >
          <Sidebar />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              paddingTop: "64px",
              overflowY: "auto", // İçeriğin kaymasını sağlar, ancak dışarıdan kaydırma çubuğunu engeller
            }}
          >
            <Header />
          </Box>
          <Box
            sx={{
              flex: 10,
              display: "flex",
              flexDirection: "column",
              paddingTop: "64px",
              overflowY: "auto",
              width: "100%", // Genişliği tam yap
              marginLeft: "0", // Sol tarafta boşluk olmasın
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} /> {/* Ana sayfa */}
              <Route path="/projects" element={<ProjectsPage />} />{" "}
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/team" element={<Team />} />
              <Route path="/admin" element={<AdminPanel />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
