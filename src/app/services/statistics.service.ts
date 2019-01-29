import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  rafpea: string;
  rafp: string;

  constructor(private _http: HttpClient) {
    this.rafpea = 'http://10.125.65.97:3000/rafpea';
    this.rafp = 'http://10.125.65.97:3000/rafp';
  }

  rentabilidadesRAFPEA() {
    return this._http.get(this.rafpea)
    .map(result => result);
  }

  rentabilidadesRAFP() {
    return this._http.get(this.rafp)
    .map(result => result);
  }
}
