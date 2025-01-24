import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Hata mesajını sıfırla

    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: email, // Backend için kullanıcı adı
        password: password, // Backend için şifre
        email: email,
      });
      console.log(response.data);

      // Backend'den gelen yanıt ile is_admin kontrolü
      if (response.data.is_admin === 1 || response.data.is_admin === true) {
        alert("Yönetici olarak giriş yapıldı.");
      } else if (response.data.is_admin === 0 || response.data.is_admin === false) {
        alert("Kullanıcı olarak giriş yapıldı.");
      } else {
        alert("Yetki durumu bilinmiyor.");
      }

      // Başarılı girişten sonra localStorage'a kullanıcı bilgilerini kaydet
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("is_admin", response.data.is_admin);

      // Başarılı girişten sonra ana sayfaya yönlendirme
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Bir hata oluştu, lütfen tekrar deneyin."
      );
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
          Giriş Yap
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
          {error && (
            <Typography color="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginBottom: "1rem" }}
          >
            Giriş Yap
          </Button>
        </form>

        <Button
          variant="text"
          onClick={() => navigate("/register")} // Kayıt sayfasına yönlendirme
        >
          Hesabınız yok mu? Kayıt olun.
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
