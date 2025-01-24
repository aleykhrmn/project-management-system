import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // useNavigate hook'unu içe aktar

const Sidebar = () => {
  const navigate = useNavigate(); // Yönlendirme fonksiyonu

  const handleHomeClick = () => {
    navigate("/"); // Ana sayfaya yönlendirme
  };

  const handleProjectClick = () => {
    navigate("/projects"); // Projeler sayfasına yönlendirme
  };

  const handleTasksClick = () => {
    navigate("/tasks"); 
  };

  const handleTeamClick = () => {
    navigate("/team"); 
  };

  const handleAdminPanelClick = () => {
    navigate("/admin");
  };

  return (
    <Box
      sx={{
        width: "13%", // Sidebar genişliği
        height: "100vh", // Tüm ekran yüksekliği
        backgroundColor: "#fff", // Arka plan rengi
        display: "flex",
        flexDirection: "column", // Dikey düzen
        justifyContent: "flex-start",
        alignItems: "center", // Ortala
        marginTop: "64px",
        position: "relative", // Konumlandırmayı etkinleştir
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "28px",
          bottom: "100px",
          right: "0",
          width: "2px",
          backgroundColor: "#BAD8B6",
        }}
      ></Box>

      {/* Butonlar */}
      <Button
        variant="contained"
        onClick={handleHomeClick} // Anasayfa butonuna tıklayınca yönlendirme
        sx={{
          width: "80%",
          margin: "25px 0",
          backgroundColor: "#86A788",
          "&:hover": { backgroundColor: "#5d9c63" },
        }}
      >
        Ana Sayfa
      </Button>
      <Button
        variant="contained"
        onClick={handleProjectClick} // Projeler butonuna tıklayınca yönlendirme
        sx={{
          width: "80%",
          margin: "20px 0",
          backgroundColor: "#86A788",
          "&:hover": { backgroundColor: "#5d9c63" },
        }}
      >
        Projeler
      </Button>
      <Button
        variant="contained"
        onClick={handleTasksClick}
        sx={{
          width: "80%",
          margin: "20px 0",
          backgroundColor: "#86A788",
          "&:hover": { backgroundColor: "#5d9c63" },
        }}
      >
        Görevler
      </Button>
      <Button
        variant="contained"
        onClick={handleTeamClick}
        sx={{
          width: "80%",
          margin: "20px 0",
          backgroundColor: "#86A788",
          "&:hover": { backgroundColor: "#5d9c63" },
        }}
      >
        Takım
      </Button>
      <Button
        variant="contained"
        onClick={handleAdminPanelClick}
        sx={{
          width: "80%",
          margin: "20px 0",
          backgroundColor: "#86A788",
          "&:hover": { backgroundColor: "#5d9c63" },
        }}
      >
        Yönetici
      </Button>
    </Box>
  );
};

export default Sidebar;
