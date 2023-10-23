import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Car, Response } from "./app.component";
import { apiToken } from "./config/apitoken";

@Injectable({
  providedIn: "root",
})
export class StrapiService {
  private endpoint = "http://localhost:1337/api/";
  private carApiUrl = `${this.endpoint}cars`;

  constructor(private http: HttpClient) {}

  getCars() {
    const opts = { params: { populate: "*" } };

    return this.http.get<Response<Car>>(this.carApiUrl, opts);
  }

  addCar(formData: FormData) {
    const headers = { Authorization: `bearer ${apiToken}` };

    return this.http.post(this.carApiUrl, formData, { headers });
  }

  deleteCar(id: number) {
    const headers = { Authorization: `bearer ${apiToken}` };

    return this.http.delete(`${this.carApiUrl}/${id}`, {
      headers,
    });
  }
}
