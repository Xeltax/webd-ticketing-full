"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rabbitmqService_1 = require("./service/rabbitmqService");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
const TicketRoutes_1 = __importDefault(require("./routes/TicketRoutes"));
const EventRoutes_1 = __importDefault(require("./routes/EventRoutes"));
const ReservationRoutes_1 = __importDefault(require("./routes/ReservationRoutes"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Autorise seulement le front local
    credentials: true // Autorise l'envoi de cookies si nécessaire
}));
app.use(express_1.default.json());
app.use("/user", UserRoutes_1.default);
app.use("/categories", CategoryRoutes_1.default);
app.use("/reservation", ReservationRoutes_1.default);
app.use("/ticket", TicketRoutes_1.default);
app.use("/event", EventRoutes_1.default);
app.use("/auth", AuthRoutes_1.default);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield rabbitmqService_1.rabbitMQService.connect();
            process.on("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
                console.log("\nGracefully shutting down...");
                yield rabbitmqService_1.rabbitMQService.close();
                process.exit(0);
            }));
            yield rabbitmqService_1.rabbitMQService.createQueue("get_users_queue");
            yield rabbitmqService_1.rabbitMQService.createQueue("get_users_response_queue"); // Nouvelle queue pour la réponse
        }
        catch (error) {
            console.error("❌ Error starting microservice:", error);
            process.exit(1);
        }
    });
}
start();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
