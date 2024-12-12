import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  GenericContainerComponent,
  GenericContentDirective
} from "../commons/components/generic-container/generic-container.component";
import {TimezoneModel} from "../commons/models/timezone-model";
import {TimezoneModelsCacheService} from "../commons/services/timezone-models-cache.service";
import {from, interval, mergeMap, Subject, takeUntil} from "rxjs";
import {WorldTimeApiService} from "../commons/services/world-time-api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClocksAddModalComponent} from "./clocks-add-modal/clocks-add-modal.component";

@Component({
  selector: 'app-clocks-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GenericContentDirective,
    GenericContainerComponent,
    ClocksAddModalComponent
  ],
  templateUrl: './clocks-dashboard.component.html',
  styleUrl: './clocks-dashboard.component.scss'
})
export class ClocksDashboardComponent implements OnInit, OnDestroy {
  timeZoneModels: Array<TimezoneModel> = [];
  private readonly _defaultInterval = 1000;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private timeZoneCache: TimezoneModelsCacheService,
              private worldTimeApiService: WorldTimeApiService,
              private modalService: NgbModal) {
    this.fetchFromCache();
  }

  private fetchFromCache(callback?: () => void) {
    this.timeZoneCache
      .timeZones$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
          this.timeZoneModels = data;

          if (callback) {
            callback();
          }
        }
      );
  }

  ngOnInit() {
    this.init();
    this.updateAllClocksWithInterval(this._defaultInterval);
  }

  private init() {
    let currentTimeZone = ClocksDashboardComponent.getCurrentTimeZone();
    this.getTimeModelByTimeZone(currentTimeZone);
  }

  private static getCurrentTimeZone(): string {
    let currentTimeZone: string = "";
    if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
      currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return currentTimeZone;
  }

  private getTimeModelByTimeZone(currentTimeZone: string) {
    this.worldTimeApiService.apiFetchTimeByTimeZone(currentTimeZone)
      .subscribe({
        next: (data) => {
          console.log('fetched data: ', data);
          this.updateTimeZoneAndSave(data);
        },
        error: (err) => console.error('Failed to fetch time:', err),
      });
  }

  private updateTimeZoneAndSave(data: any) {
    let foundCurrentTimeZone = this.timeZoneModels?.some(tz => tz.name === data.timeZone);
    let currentTimeZone = this.toTimeZoneModel(data);

    if (foundCurrentTimeZone) {
      let searchElement = this.timeZoneModels.find(tz => tz.name === data.timeZone) as TimezoneModel;
      let currentTimeZoneIndex = this.timeZoneModels.indexOf(searchElement);
      this.timeZoneModels.splice(currentTimeZoneIndex, 1, currentTimeZone);
    } else {
      this.timeZoneModels.push(currentTimeZone);
    }

    this.timeZoneCache.saveAll(this.timeZoneModels);
  }

  private toTimeZoneModel(data: any): TimezoneModel {
    function calcOffsetInHrs(seconds: number) {
      let prefix = '+';
      if (seconds < 0) {
        prefix = '-';
      }
      seconds = Math.abs(seconds);
      let date = new Date(seconds * 1000);
      let hours = date.getUTCHours();
      let minutes = date.getUTCMinutes();

      return prefix + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    }

    return {
      name: data?.timeZone,
      abbreviation: data.dstInterval?.dstName,
      offset: calcOffsetInHrs(data?.currentUtcOffset['seconds']),
      localDateTime: data?.currentLocalTime,
      dst: data?.isDayLightSavingActive,
      dst_from: data.dstInterval?.dstStart,
      dst_to: data.dstInterval?.dstEnd,
    };
  }

  private updateAllClocksWithInterval(millis: number) {
    interval(millis)
      .pipe(
        mergeMap(() => from(this.timeZoneModels.map(timezone => timezone.name))),
        mergeMap(
          (timezone) => this.worldTimeApiService.apiFetchTimeByTimeZone(timezone as string),
          2
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (data) => this.updateTimeZoneAndSave(data),
        error: (err) => console.error('Failed to fetch time:', err),
      });
  }

  openModalAddNewClock(view: TemplateRef<any>) {
    this.modalService.open(view);
  }

  onAddNewTimeZoneSelected(timeZoneSelected: string) {
    this.modalService.dismissAll();
    console.log('dashboard timeZoneSelected: ', timeZoneSelected);

    this.getTimeModelByTimeZone(timeZoneSelected);
  }

  onModalCancel() {
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
