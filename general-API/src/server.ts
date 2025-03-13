import express from "express";
import cors from "cors";
import { rabbitMQService } from "./service/rabbitmqService";
import userRoutes from "./routes/UserRoutes";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000", // Autorise seulement le front local
  credentials: true // Autorise l'envoi de cookies si nécessaire
}));

app.use(express.json());
app.use("/user", userRoutes);
// app.use("/bankAccount", BankingAccountRoutes);
// app.use("/auth", AuthRoutes);
// app.use("/transfer", TransferRoutes);

async function start() {
  try {
    await rabbitMQService.connect();

    process.on("SIGINT", async () => {
      console.log("\nGracefully shutting down...");
      await rabbitMQService.close();
      process.exit(0);
    });

    console.log("🚀 Microservice User started!");
  } catch (error) {
    console.error("❌ Error starting microservice:", error);
    process.exit(1);
  }
}

start();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});