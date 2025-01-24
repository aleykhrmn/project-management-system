import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Divider, Grid } from '@mui/material';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu

  useEffect(() => {
    // API'den takım ve üyelerini çekiyoruz
    fetch('http://localhost:8000/teams')
      .then(response => response.json())
      .then(data => {
        setTeams(data);
        setLoading(false); // Veri yüklendiğinde yükleme durumu bitiyor
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setLoading(false); // Hata durumunda da yükleme durumu bitiyor
      });
  }, []);

  // Yükleme durumu kontrolü
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">Takımlar</Typography>
      {teams.length === 0 ? (
        <Typography variant="body1" align="center">Henüz takım bulunmamaktadır.</Typography>
      ) : (
        <Grid container spacing={2}>
          {teams.map((team, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {team.team_name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Proje: {team.project_name}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    Üyeler:
                  </Typography>
                  {team.members.map((member, memberIndex) => (
                    <Typography key={memberIndex} variant="body2" sx={{ marginLeft: "20px", color: 'text.primary' }}>
                      {member.username} - <strong>Rol:</strong> {member.role}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Teams;
