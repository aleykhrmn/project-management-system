import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcıları backend'den alma
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users"); // Kullanıcıları çekmek için doğru endpoint
        setUsers(response.data); // Gelen kullanıcı verilerini state'e kaydet
      } catch (error) {
        console.error("Kullanıcı verileri alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Kullanıcının projelerini ve rollerini almak için kullanılan fonksiyon
  const fetchUserTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${userId}/tasks`);
      return response.data; // Proje ve rol verisini döndürüyoruz
    } catch (error) {
      console.error("Projeler alınırken hata oluştu:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "30px",
        }}
      >
        Kullanıcılar ve Projeleri
      </Typography>

      {/* Kullanıcı Kartları */}
      <Grid container spacing={3}>
        {users.map((user, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  {user.username} {/* Backend'den gelen kullanıcı adı */}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: "10px" }}
                >
                  {user.email} {/* Eğer e-posta bilgisi varsa */}
                </Typography>
                <Divider sx={{ marginY: "15px" }} />

                {/* Kullanıcının projeleri ve rolleri */}
                <Box sx={{ marginTop: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Projeler:
                  </Typography>
                  {user.projects && user.projects.length > 0 ? (
                    user.projects.map((project, projectIndex) => (
                      <Box key={projectIndex} sx={{ marginBottom: "10px" }}>
                        <Typography variant="body1">
                          <strong>Proje:</strong> {project.projectName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Rol:</strong> {project.role}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Bu kullanıcının projeleri yok.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UsersList;
