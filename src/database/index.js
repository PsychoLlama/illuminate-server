import Pool from 'pg-pool';

// Use native postgres bindings.
const pool = new Pool();

export default pool;

const schema = `
(
  light TEXT,
  color VARCHAR(6),
  time TIMESTAMP
)
`;

// Create a table to store light history.
export const initDatabase = () => pool.query(
  `CREATE TABLE IF NOT EXISTS history ${schema};`
);
