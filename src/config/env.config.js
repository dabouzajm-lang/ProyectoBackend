import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["PORT", "NODE_ENV"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Error de configuración: la variable de entorno ${variable} es obligatoria.`
    );
  }
}

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV
};