import 'dotenv/config'
import pg from 'pg'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

console.log('POOL QUERY: ')
pool
  .query('SELECT NOW()')
  .then(() => console.log('DB OK'))
  .catch((err) => console.error(err))
