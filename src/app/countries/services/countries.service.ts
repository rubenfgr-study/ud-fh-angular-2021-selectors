import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { CountrySmall } from '../interfaces/countries.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regions: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(private http: HttpClient) {}

  getCountriesByRegion(region: string): Observable<CountrySmall[]> {
    if (!region) {
      return of([]);
    }
    const url: string = `${this._baseUrl}/region/${region}?fields=name;alpha3Code`;
    return this.http.get<CountrySmall[]>(url);
  }

  getCountryByCode(code: string): Observable<CountrySmall | null> {
    if (!code) {
      return of(null);
    }
    const url: string = `${this._baseUrl}/alpha/${code}?fields=name;alpha3Code;borders`;
    return this.http.get<CountrySmall>(url);
  }

  getFrontiersByCodes(codes: string[]): Observable<CountrySmall[]> {
    if (codes.length === 0) {
      return of([]);
    }
    /* const url: string = `${this._baseUrl}/alpha?codes=${codes.join(
      ';'
    )}&fields=name;alpha3Code`;
    return this.http.get<CountrySmall[]>(url); */

    const requests: Observable<CountrySmall>[] = [];

    codes.forEach((code) => {
      const request = this.http.get<CountrySmall>(
        `${this._baseUrl}/alpha/${code}?fields=name;alpha3Code`
      );
      requests.push(request);
    });

    return combineLatest(requests);
  }
}
