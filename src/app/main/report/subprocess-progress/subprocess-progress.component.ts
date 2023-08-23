import {Component, Input, OnInit} from '@angular/core';
import {Report} from "../report.model";

@Component({
  selector: 'app-subprocess-progress',
  templateUrl: './subprocess-progress.component.html',
  styleUrls: ['./subprocess-progress.component.scss']
})
export class SubprocessProgressComponent implements OnInit {
  // @Input() name: string;
  @Input() report: Report;

  constructor() { }

  ngOnInit(): void {
  }

}
