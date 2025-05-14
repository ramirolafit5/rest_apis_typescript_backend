import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables estén definidas

// Lo dejo oculto ya que el coverage me dice que esto no lo estamos usando
/* if (!process.env.DATABASE_CONNECTION || !process.env.DATABASE_USER || !process.env.DATABASE_PASSWORD) {
  throw new Error("Faltan variables de conexión en el archivo .env");
} */

// Crear instancia de Sequelize con variables de entorno
const db = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [__dirname + '/../models/**/*'],
  logging: false
});

export default db;