import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BaseModalComponent, BasicModalContentDirective} from "../../commons/components/base-modal/base-modal.component";
import {WorldTimeApiService} from "../../commons/services/world-time-api.service";
import {TimezoneModelsCacheService} from "../../commons/services/timezone-models-cache.service";
import {TimezoneNamesCacheService} from "../../commons/services/timezone-names-cache.service";
import {Subject, takeUntil} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-clocks-add-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BasicModalContentDirective,
    BaseModalComponent
  ],
  templateUrl: './clocks-add-modal.component.html',
  styleUrl: './clocks-add-modal.component.scss'
})
export class ClocksAddModalComponent implements OnInit {

  @Output() public onCancel = new EventEmitter<any>();
  @Output() public onAddition = new EventEmitter<string>();
  selectedTimeZone: string = '';
  timeZoneNames: string[] = [];
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private apiService: WorldTimeApiService,
              private cacheService: TimezoneNamesCacheService) {
    this.cacheService
      .allTimeZonesNames$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
          this.timeZoneNames = data;
        }
      );
  }

  ngOnInit() {
    if (this.isTimeZonesEmpty) {

      this.apiService
        .apiFetchAllTimeZoneNames()
        .subscribe({
          next: (data) => {
            this.timeZoneNames = data;
            this.cacheService.saveAll(data);
          }
        });
    }
  }

  get isTimeZonesEmpty() {
    return !this.timeZoneNames || this.timeZoneNames.length == 0;
  }

  add() {
    this.onAddition.emit(this.selectedTimeZone);
  }

  cancel() {
    this.onCancel.emit(true);
  }
}
