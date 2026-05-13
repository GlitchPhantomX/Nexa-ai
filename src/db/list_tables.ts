import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

async function main() {
  const url = process.env.DATABASE_URL!;
  const db = drizzle(url);
  
  // Extract host for logging (safe)
  const host = new URL(url).host;
  console.log("Connecting to host:", host);

  console.log("Listing all tables in 'public' schema...");
  const tables = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
  `);
  
  console.log("Tables found:", JSON.stringify(tables, null, 2));
}

main().catch(console.error);
