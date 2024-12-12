import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {TimezoneModel} from "../models/timezone-model";
import {BehaviorSubject} from "rxjs";
import {BasicCacheService} from "./basic-cache.service";

@Injectable({
  providedIn: 'root'
})
export class TimezoneModelsCacheService extends BasicCacheService<TimezoneModel> {

  public timeZones$ = new BehaviorSubject<Array<TimezoneModel>>([]);
  public override key = 'my-timezones-list'

  constructor(localStorageService: LocalStorageService) {
    super(localStorageService);
    let timeZones = this.getAll();
    if (timeZones) {
      this.timeZones$.next(timeZones);
    }
  }
}
