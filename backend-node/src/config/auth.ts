import "dotenv/config";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error(
    "Configure JWT_SECRET com pelo menos 32 caracteres no backend-node/.env.",
  );
}

export const jwtSecret: string = secret;
export const jwtExpiresIn = "7d";