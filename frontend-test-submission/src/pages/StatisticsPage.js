import React, { useState } from 'react';
import {
  TextField, Button, Typography, Container, Card, CardContent, Box
} from '@mui/material';
import axios from 'axios';
import log from '../logging/logger';

function StatisticsPage() {
  const [shortcode, setShortcode] = useState('');
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
      setData(res.data);
      await log('frontend', 'info', 'component', `Fetched stats for ${shortcode}`);
    } catch (err) {
      await log('frontend', 'error', 'component', err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>📊 URL Analytics</Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          label="Enter Shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleFetch}>Get Stats</Button>
      </Box>

      {data && (
        <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
          <CardContent>
            <Typography><strong>Original URL:</strong> {data.originalUrl}</Typography>
            <Typography><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</Typography>
            <Typography><strong>Expires:</strong> {new Date(data.expiry).toLocaleString()}</Typography>
            <Typography><strong>Total Clicks:</strong> {data.totalClicks}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Click Details:</Typography>
            {data.clickDetails.map((click, i) => (
              <Box key={i} sx={{ ml: 2 }}>
                <Typography variant="body2">• {click.timestamp} - {click.referrer} ({click.location})</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default StatisticsPage;
