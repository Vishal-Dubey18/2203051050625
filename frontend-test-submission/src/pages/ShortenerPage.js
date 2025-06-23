import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import log from '../logging/logger';

const API_BASE_URL = 'http://localhost:5000/shorturls';

const ShortenerPage = () => {
  const [inputs, setInputs] = useState(
    Array(5).fill({ url: '', validity: '', shortcode: '' })
  );
  const [results, setResults] = useState(Array(5).fill(null));
  const [errors, setErrors] = useState(Array(5).fill(''));

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const newResults = [...results];
    const newErrors = [...errors];

    for (let i = 0; i < inputs.length; i++) {
      const { url, validity, shortcode } = inputs[i];

      if (!url || !validateURL(url)) {
        newErrors[i] = 'Please enter a valid URL';
        newResults[i] = null;
        continue;
      }

      try {
        const res = await axios.post(API_BASE_URL, {
          url,
          validity: validity ? parseInt(validity) : undefined,
          shortcode: shortcode || undefined,
        });

        newResults[i] = res.data;
        newErrors[i] = '';
        await log('frontend', 'info', 'component', `Short URL created at index ${i}`);
      } catch (error) {
        newErrors[i] = 'Failed to shorten URL';
        newResults[i] = null;
        await log('frontend', 'error', 'component', `Error at index ${i}: ${error.message}`);
      }
    }

    setErrors(newErrors);
    setResults(newResults);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#1976d2' }}
      >
        🔗 URL Shortener Form
      </Typography>

      {inputs.map((input, index) => (
        <Paper
          elevation={3}
          key={index}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0px 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Link #{index + 1}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Long URL"
                variant="outlined"
                fullWidth
                value={input.url}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Validity (in minutes)"
                variant="outlined"
                fullWidth
                type="number"
                value={input.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Custom Shortcode (optional)"
                variant="outlined"
                fullWidth
                value={input.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
              />
            </Grid>

            {results[index] && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: 'green', mt: 2 }}>
                  ✅ Short Link:{' '}
                  <a
                    href={results[index].shortLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#1565c0' }}
                  >
                    {results[index].shortLink}
                  </a>{' '}
                  <br />
                  ⏳ Expires: {new Date(results[index].expiry).toLocaleString()}
                </Typography>
              </Grid>
            )}

            {errors[index] && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errors[index]}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      <Box textAlign="center" mt={5}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontSize: '1rem', borderRadius: 2 }}
          onClick={handleSubmit}
        >
          🚀 Shorten URLs
        </Button>
      </Box>
    </Container>
  );
};

export default ShortenerPage;
