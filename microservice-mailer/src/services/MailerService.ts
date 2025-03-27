import {MailtrapClient} from "mailtrap";
import * as dotenv from "dotenv";
import {rabbitMQService} from "./rabbitmqService";

dotenv.config();

const client = new MailtrapClient({
    token: process.env.MAILER_TOKEN ? process.env.MAILER_TOKEN : "",
    sandbox: false,
});

const sender = {
    email: "hello@demomailtrap.co",
    name: "Ticketing App",
};

export const sendMail = async () => {
    console.log("📨 Mailer service started!");
    await rabbitMQService.consumeMessages("send_mail_queue", async (msg, properties) => {
        const replyTo = properties.replyTo || "send_mail_response_queue";
        const userEmail = msg.reservation.user.email;
        console.log(`📤 [${Date.now()}] Sending mail to ${userEmail}`);
        const mailSubject: string = "Reservation pour l'événement " + msg.reservation.event.name;
        const mailText: string = "Bonjour,\n\n" +
            "Nous vous confirmons votre réservation pour l'événement " + msg.reservation.event.name + ".\n" +
            "Votre billet est le suivante : \n\n" + msg.reservation.ticket.name + " " + msg.reservation.ticket.price + " €\n\n"
        try {
            client
                .send({
                    from: sender,
                    to: [{ email: userEmail }],
                    subject: mailSubject,
                    text: mailText,
                    category: "Integration Test",
                })
                .then(console.log, console.error);
            await rabbitMQService.sendMessage(replyTo, "mail sent", {correlationId: properties.correlationId});
        } catch (error: any) {
            await rabbitMQService.sendMessage(replyTo, {error: error.message}, {correlationId: properties.correlationId});
        }
    });
}