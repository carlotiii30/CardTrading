import { Client } from "pg";

describe("Database Service", () => {
  it("should connect to the database and fetch the current time", async () => {
    const client = new Client({
      user: "pokemon_admin",
      host: "db",
      database: "pokemon_trading",
      password: "Pokemon",
      port: 5432,
    });

    try {
      await client.connect();
      const res = await client.query("SELECT NOW()");
      expect(res.rows.length).toBe(1);
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    } finally {
      await client.end();
    }
  });
});
