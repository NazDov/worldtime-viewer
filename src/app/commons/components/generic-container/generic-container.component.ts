import {Component, ContentChild, Directive, Input, OnInit, TemplateRef} from '@angular/core';
import {CommonModule} from "@angular/common";
@Directive({
  selector: 'ng-template[appGenericContent]',
  standalone: true
})
export class GenericContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}


@Component({
  selector: 'app-generic-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-container.component.html',
  styleUrl: './generic-container.component.scss'
})
export class GenericContainerComponent implements OnInit  {
  @ContentChild(GenericContentDirective)
  basicContent!: GenericContentDirective;
  @Input() header!: string;

  constructor() {}

  ngOnInit() {}
}
