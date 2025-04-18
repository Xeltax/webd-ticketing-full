import {Router} from "express";
import { rabbitMQService } from "../service/rabbitmqService";
import {authenticateJWT} from "../Middleware/AuthMiddleware";

const router = Router();

router.post("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create reservation`);
        const reservation = await rabbitMQService.requestResponse(
            "create_reservation_queue",
            { request: req.body },
            "create_reservation_response_queue",
            1000
        );
        console.log(`📤 [${Date.now()}] Sending request to send mail`);
        const response = await rabbitMQService.requestResponse(
            "send_mail_queue",
            { request: "sendMail", reservation: reservation },
            "send_mail_response_queue",
            1000
        );
        console.log(response);
        res.status(200).json(reservation);
    } catch (error: any) {
        console.error(`❌ Error creating reservation:`, error);
        res.status(500).json({ error: "Error creating reservation", message: error.message });
    }
});

router.get("", authenticateJWT, async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get reservations`);
        const reservations = await rabbitMQService.requestResponse(
            "get_reservations_queue",
            { request: "getAllReservations" },
            "get_reservations_response_queue",
            1000
        );
        res.status(200).json(reservations);
    } catch (error: any) {
        console.error(`❌ Error fetching reservations:`, error);
        res.status(500).json({ error: "Error fetching reservations", message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get reservation by id`);
        const reservation = await rabbitMQService.requestResponse(
            "get_user_reservations_queue",
            { request: "getReservationById", id: req.params.id },
            "get_user_reservations_response_queue",
            1000
        );
        res.status(200).json(reservation);
    } catch (error: any) {
        console.error(`❌ Error fetching reservation by Userid:`, error);
        res.status(500).json({ error: "Error fetching reservation by Userid", message: error.message });
    }
})

router.delete("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete reservation by id`);
        const reservation = await rabbitMQService.requestResponse(
            "delete_reservation_queue",
            { request: "deleteReservationById", id: req.params.id },
            "delete_reservation_response_queue",
            1000
        );
        res.status(200).json(reservation);
    } catch (error: any) {
        console.error(`❌ Error deleting reservation by id:`, error);
        res.status(500).json({ error: "Error deleting reservation by id", message: error.message });
    }
})

export default router;