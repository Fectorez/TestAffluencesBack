import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ReservationsResponse, TimetablesResponse } from "./models";

class Api {
  instance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/'
  });

  async getReservations(date: string, resourceId: string): Promise<AxiosResponse<ReservationsResponse>> {
    return await this.instance.get<ReservationsResponse>(`/reservations?date=${date}&resourceId=${resourceId}`);
  }

  async getTimetables(date: string, resourceId: string): Promise<AxiosResponse<TimetablesResponse>> {
    return await this.instance.get<TimetablesResponse>(`/timetables?date=${date}&resourceId=${resourceId}`);
  }
}

export default new Api();
