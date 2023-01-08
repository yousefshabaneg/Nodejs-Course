require('dotenv').config({ path: './config.env' });
require('./db');
const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
