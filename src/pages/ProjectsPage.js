import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');  // Durum filtresi

  // Projeleri backend'den alalım
  useEffect(() => {
    axios.get('http://localhost:8000/projects')  // FastAPI backend URL'nizi buraya yazın
      .then(response => {
        console.log("Projeler:", response.data);
        setProjects(response.data);  // Gelen projeleri state'e ekliyoruz
        setFilteredProjects(response.data);  // Başlangıçta tüm projeleri göster
      })
      .catch(error => {
        console.error('Projeler alınırken hata oluştu:', error);
      });
  }, []);  // Sayfa yüklendiğinde yalnızca bir kez çalışacak

  // Durum filtresini değiştirdiğimizde projeleri filtreleyelim
  const handleStatusFilterChange = (event) => {
    const filterValue = event.target.value;
    setStatusFilter(filterValue);

    if (filterValue) {
      // Filtreye göre projeleri güncelle
      const filtered = projects.filter(project => project.status === filterValue);
      setFilteredProjects(filtered);
    } else {
      // Filtre kaldırıldığında tüm projeleri göster
      setFilteredProjects(projects);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">Projeler</Typography>

      {/* Durum filtresi */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Durum"
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="ongoing">Devam Ediyor</MenuItem>
            <MenuItem value="planned">Planlanmış</MenuItem>
            <MenuItem value="completed">Tamamlanmış</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Projeler Tablosu */}
      <TableContainer component={Paper} sx={{ marginTop: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Proje Adı</strong></TableCell>
              <TableCell><strong>Açıklama</strong></TableCell>
              <TableCell><strong>Başlangıç Tarihi</strong></TableCell>
              <TableCell><strong>Bitiş Tarihi</strong></TableCell>
              <TableCell><strong>Durum</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={project.status.charAt(0).toUpperCase() + project.status.slice(1)} color={project.status === 'ongoing' ? 'primary' : project.status === 'planned' ? 'warning' : 'success'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectsPage;
