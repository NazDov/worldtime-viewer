import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export abstract class BasicCacheService<T> {
  protected key: string = "";

  protected constructor(private localStorageService: LocalStorageService) {}

  public saveAll(items: Array<T>): void {
    this.localStorageService.setItem(this.key, JSON.stringify(items));
  }

  public getAll(): Array<T> {
    let rawData = this.localStorageService.getItem(this.key);
    return rawData ? JSON.parse(rawData) : [];
  }

  public clear(): void {
    this.localStorageService.removeItem(this.key);
  }

}
