import {Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {CommonModule} from "@angular/common";

@Directive({
  selector: 'ng-template[appBasicModalContent]',
  standalone: true
})
export class BasicModalContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss'
})
export class BaseModalComponent {
  @ContentChild(BasicModalContentDirective)
  basicContent!: BasicModalContentDirective;
  @Input() public modalTitle: string = '';
  @Input() public isDisabled: boolean = true;
  @Output() public onCancel = new EventEmitter<any>();
  @Output() public onAddition = new EventEmitter<any>();

   add(data?: any) {
     this.onAddition.emit(data);
   }

   cancel() {
     this.onCancel.emit(true);
   }

}

