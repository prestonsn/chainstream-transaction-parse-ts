import dotenv from "dotenv";
dotenv.config();

const retrieveEnvVariable = (variableName: string) => {
  const variable = process.env[variableName] || "";
  if (!variable) {
    console.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

export const TOKEN = retrieveEnvVariable("TOKEN");
export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const RAYDUIM_PROGRAM_ID = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
