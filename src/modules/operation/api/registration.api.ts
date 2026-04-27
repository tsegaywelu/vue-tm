import { getApi } from "@/utils/getApi";
import type {
  Driver,
  Insurance,
  Trasporter,
  Vehicle,
} from "../operation.types";

const registration_api = getApi("");

export function add_transporter(data: any) {
  return registration_api
    .addAuthenticationHeader()
    .post<Trasporter>("/transporter", data);
}

export function add_driver(data: any) {
  return registration_api
    .addAuthenticationHeader()
    .post<Driver>("/driver", data);
}

export function add_vehicle(data: any) {
  return registration_api
    .addAuthenticationHeader()
    .post<Vehicle>("/vehicle", data);
}

export function add_insurance(data: any) {
  return registration_api
    .addAuthenticationHeader()
    .post<Insurance>("/insurance", data);
}
