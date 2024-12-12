import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {BehaviorSubject} from "rxjs";
import {BasicCacheService} from "./basic-cache.service";

@Injectable({
  providedIn: 'root'
})
export class TimezoneNamesCacheService extends BasicCacheService<string> {

  public allTimeZonesNames$ = new BehaviorSubject<string[]>([]);
  public override key = 'all-timezones-names-list'

  constructor(localStorageService: LocalStorageService) {
    super(localStorageService);

    let timeZoneNames = this.getAll();
    if (timeZoneNames) {
      this.allTimeZonesNames$.next(timeZoneNames);
    }
  }
}
