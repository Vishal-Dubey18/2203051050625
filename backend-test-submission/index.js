const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', urlRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
