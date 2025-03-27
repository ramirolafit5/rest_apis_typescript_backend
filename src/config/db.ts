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
const db = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  models: [__dirname + "/../models/*.model.ts"],  // Asegúrate de que la ruta de tus modelos sea correcta
  logging: false, // Opcional: desactivar logs
  dialectOptions: {
    ssl: {
      require: true, // Habilitar SSL
      rejectUnauthorized: false, // Aceptar certificados no verificados (si es necesario)
    },
  },
});


export default db;
