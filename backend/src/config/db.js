const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no está definida');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('ERROR conectando a la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Base de datos conectada correctamente');
  release();
});

pool.on('error', (err) => console.error('DB pool error:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};