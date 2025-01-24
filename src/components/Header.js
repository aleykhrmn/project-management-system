import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  // localStorage'dan isLoggedIn değeri alınıyor (varsa)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    return savedLoginState === "false"; // Eğer "true" stringi varsa true olarak kabul et
  });

  // Çıkış yapma işlemi
  const handleLogout = () => {
    setIsLoggedIn(false); // Oturumu kapat
    localStorage.setItem("isLoggedIn", "false"); // Çıkış yapıldığında localStorage'da durumu güncelle
    // Burada backend'e çıkış isteği gönderebilirsiniz
  };

  // Giriş yapıldığında state'i ve localStorage'ı güncelle
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  useEffect(() => {
    // Giriş durumu değiştiğinde localStorage'ı güncelle
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff", // Header arka plan rengi
        zIndex: 10, // Sidebar'ın üstünde görünmesi için
        boxShadow: "none", // Gölgeyi kaldır
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "1.5%", // Başlangıç noktasını kısaltmak için
          right: "1.5%", // Bitiş noktasını kısaltmak için
          bottom: 0,
          borderBottom: "1px solid #BAD8B6", // Alt çizgi
        },
      }}
    >
      <Toolbar
        sx={{
          height: "64px",
          display: "flex",
          justifyContent: "space-between", // Başlık ve butonları ayır
          alignItems: "center", // Dikeyde ortala
        }}
      >
        {/* Başlık */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem", // Daha büyük başlık font boyutu
            fontWeight: "bold", // Kalın yazı stili
            color: "#5d9c63", // Yeşil renk
            letterSpacing: "2px", // Harfler arasında boşluk
          }}
        >
          Görev ve Proje Yönetim Sistemi
        </Typography>

        {/* Profil ve Çıkış/Giriş Butonları */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button variant="text" sx={{ color: "#5d9c63" }}>
                Profil
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#5d9c63", color: "#fff" }}
                onClick={handleLogout} // Çıkış işlemi
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              {/* Giriş Yap butonu sadece giriş yapılmamışsa görünsün */}
              {!isLoggedIn && (
                <Button
                  variant="text"
                  sx={{ color: "#5d9c63" }}
                  component={Link}
                  to="/login" // Login sayfasına yönlendirme
                  onClick={handleLogin} // Giriş işlemi
                >
                  Giriş Yap
                </Button>
              )}
              <Button
                variant="text"
                sx={{ color: "#5d9c63" }}
                component={Link}
                to="/register" // Kayıt olma sayfasına yönlendirme
              >
                Kayıt Ol
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
