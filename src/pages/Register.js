import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Yönetici olup olmadığı
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Şifrelerin uyuşup uyuşmadığını kontrol et
    if (password !== confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }

    // Backend ile entegrasyon yaparak kullanıcıyı kaydet
    const userData = {
      username,
      email,
      password,
      is_admin: isAdmin, // Yönetici olup olmadığı
    };

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Kayıt başarılı!");
        // Kayıt başarılıysa login sayfasına yönlendirme
        navigate("/login");
      } else {
        alert(data.message || "Kayıt sırasında bir hata oluştu.");
      }
    } catch (error) {
      alert("Bir hata oluştu: " + error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Kayıt Ol
        </Typography>

        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <TextField
            label="Kullanıcı Adı"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="E-posta"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Şifre"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Şifreyi Onayla"
            variant="outlined"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)} // Yönetici onay kutusu
                color="primary"
              />
            }
            label="Yönetici olarak kaydol"
            sx={{ marginBottom: "1rem" }}
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginBottom: "1rem" }}
          >
            Kayıt Ol
          </Button>
        </form>

        <Button
          variant="text"
          onClick={() => navigate("/login")} // Login sayfasına yönlendirme
        >
          Zaten hesabınız var mı? Giriş yapın.
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
