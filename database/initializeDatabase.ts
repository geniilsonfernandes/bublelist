import * as SQLite from "expo-sqlite";
import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA encoding = "UTF-8";

    CREATE TABLE IF NOT EXISTS list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL, -- Suporta emojis melhor que TEXT
      icon VARCHAR(10), -- Emojis ocupam poucos bytes
      color VARCHAR(20),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      budget INTEGER -- Armazene em centavos para precisão
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      checked BOOLEAN NOT NULL,
      value INTEGER, -- Armazene centavos em vez de float
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(list_id) REFERENCES list(id) ON DELETE CASCADE
    );
  `);
}
export const db = SQLite.openDatabaseSync("tlist.db");
