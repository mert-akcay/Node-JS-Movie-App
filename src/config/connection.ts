import { createConnection } from "typeorm";

//Create MySQL Connection
export const connection = async () => {
  await createConnection();
  console.log("Database connection succesfull");
  
};
