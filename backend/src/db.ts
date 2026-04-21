import { Pool } from 'pg'
import 'dotenv/config'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

console.log('POOL QUERY: ')
pool
  .query('SELECT NOW()')
  .then(() => console.log('DB OK'))
  .catch((err) => console.error(err))
