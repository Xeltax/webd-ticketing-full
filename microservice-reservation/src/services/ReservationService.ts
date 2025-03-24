import { ReservationRepository } from "../Repositories/ReservationRepository";
import { ReservationDTO } from "../Dtos/ReservationDTO";

export class ReservationService {
    private reservationRepo = new ReservationRepository();

    async getAllReservations() {
        return await this.reservationRepo.getAll();
    }

    async getUserReservations(userId: string) {
        return await this.reservationRepo.getByUser(userId);
    }

    async createReservation(data: ReservationDTO) {
        return await this.reservationRepo.save(data);
    }

    async deleteReservation(id: string) {
        return await this.reservationRepo.delete(id);
    }
}