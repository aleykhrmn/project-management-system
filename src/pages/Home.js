import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js pluginlerini başlatıyoruz
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Veritabanından projeleri çekiyoruz
    axios.get('http://localhost:8000/projects')  // FastAPI backend URL'nizi buraya yazın
      .then(response => {
        setProjects(response.data);  // Projeleri state'e kaydediyoruz
        setLoading(false);  // Yükleme bitiyor
      })
      .catch(error => {
        console.error('Projeler alınırken hata oluştu:', error);
        setLoading(false);
      });
  }, []);

  // Yükleme durumunda gösterilecek animasyon
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Proje durumlarını hesaplayalım
  const totalProjects = projects.length;
  const completedProjects = projects.filter(project => project.status === 'completed').length;
  const ongoingProjects = projects.filter(project => project.status === 'ongoing').length;
  const plannedProjects = projects.filter(project => project.status === 'planned').length;

  // Grafik için veriler
  const chartData = {
    labels: ['Tamamlanmış', 'Devam Eden', 'Planlanmış'],
    datasets: [
      {
        data: [completedProjects, ongoingProjects, plannedProjects],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],  // Renkler: yeşil, turuncu, mavi
        hoverBackgroundColor: ['#388e3c', '#f57c00', '#1976d2'],
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Dairesel Grafik ve Renkli Card'lar */}
      <Grid container spacing={3} sx={{ marginTop: 4 }} justifyContent="center">
        {/* Dairesel Grafik */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Proje Durumu Dağılımı</Typography>
            <Pie data={chartData} />
          </Paper>
        </Grid>

        {/* Renkli Card'lar */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#f3f4f6', color: '#000', textAlign: 'center' }}>
                <Typography variant="h6">Toplam Projeler</Typography>
                <Typography variant="h4">{totalProjects}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#4caf50', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">Tamamlanmış Projeler</Typography>
                <Typography variant="h4">{completedProjects}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#ff9800', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">Devam Eden Projeler</Typography>
                <Typography variant="h4">{ongoingProjects}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#2196f3', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">Planlanmış Projeler</Typography>
                <Typography variant="h4">{plannedProjects}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Kısa Proje Özeti */}
      <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>Son Projeler</Typography>
      <Grid container spacing={3}>
        {projects.slice(0, 3).map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2">{project.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
