import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delayWhen, Observable, tap, throwError, timer} from 'rxjs';
import {catchError, retryWhen, scan} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WorldTimeApiService {
  private static readonly API_URL = environment.baseApi;
  private readonly _maxRetry = 10;

  constructor(private http: HttpClient) {}

  apiFetchTimeByTimeZone(timeZone: string): Observable<any> {
    return this.http.get(this.createUri([`zone?timeZone=${timeZone}`]))
      .pipe(
        catchError((error) => {
          console.error('Error fetching time zone data:', error);
          return throwError(() => error);
        }),
        this.withRetry()
      );
  }

  apiFetchAllTimeZoneNames(): Observable<any> {
    return this.http.get(this.createUri(['availabletimezones']))
      .pipe(
        catchError((error) => {
          console.error('Error fetching time zone names:', error);
          return throwError(() => error);
        }),
        this.withRetry()
      );
  }

  private withRetry() {
    return retryWhen(errors =>
      errors.pipe(
        scan((retryCount, error) => {
          if (retryCount >= this._maxRetry) {
            throw error;
          }
          return retryCount + 1;
        }, 0),
        tap(value => console.log(`${value} has failed, continue retry`)),
        // retry with exponential backoff
        delayWhen(value => timer(Math.pow(2, value) * 1000))
      )
    );
  }

  private createUri(paths: string[]) {
    let finalUrl = WorldTimeApiService.API_URL;
    paths.forEach((path) => {
      finalUrl = finalUrl.concat('/').concat(path);
    });
    return finalUrl;
  }
}
