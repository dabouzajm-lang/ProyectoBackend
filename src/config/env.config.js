import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI"
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Error de configuración: la variable de entorno ${variable} es obligatoria.`
    );
  }
}

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI
};