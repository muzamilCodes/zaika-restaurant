import 'dotenv/config';
import connectDb from "./config/connectDb.js";
import { seedDatabase } from './config/seed.js';
import { createApp } from "./app.js";

const app = createApp();
const port = process.env.PORT || 5000;

async function bootstrap() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  await connectDb();
  await seedDatabase();

  app.listen(port, () => {
    console.log(`Zaika backend running on port ${port}`);
  });
}

bootstrap();
// Server restarted cleanly
