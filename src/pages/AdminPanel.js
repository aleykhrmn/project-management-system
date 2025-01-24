import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";

const AdminPanel = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Yönetici Paneli
      </Typography>

      {/* Proje Durumu */}
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h6">Proje Durumu</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Proje 1</Typography>
                <Typography variant="body2">Durum: Devam Ediyor</Typography>
                <Button variant="contained" color="primary" sx={{ marginTop: "1rem" }}>
                  Detayları Gör
                </Button>
              </CardContent>
            </Card>
          </Grid>
          {/* Diğer projeler */}
        </Grid>
      </Box>

      {/* Takım Üyeleri Performans Raporu */}
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h6">Takım Üyeleri Performansı</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Aleyna</Typography>
                <Typography variant="body2">Tamamlanan Görevler: 10</Typography>
                <Typography variant="body2">Performans: İyi</Typography>
                <Button variant="contained" color="secondary" sx={{ marginTop: "1rem" }}>
                  Detaylı İncele
                </Button>
              </CardContent>
            </Card>
          </Grid>
          {/* Diğer üyeler */}
        </Grid>
      </Box>

      {/* Risk Yönetimi */}
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h6">Risk Durumu</Typography>
        <Typography variant="body2">Henüz risk bulunmamaktadır.</Typography>
      </Box>
    </Box>
  );
};

export default AdminPanel;
