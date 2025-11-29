const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'trading_app',
  user: 'postgres',
  password: 'postgres',
});

client.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL successfully!');
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('PostgreSQL version:', result.rows[0].version);
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });
