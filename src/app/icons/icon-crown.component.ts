import {Component, input} from '@angular/core';

/* eslint-disable max-len */
@Component({
  selector: 'app-icon-crown',
  template: `
    <!-- eslint-disable max-len -->
    <svg id="crown" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 512 512"
         xmlns="http://www.w3.org/2000/svg">
      <path id="bottom" fill="currentColor"
            d="m 258.4,410.7 c -50,0 -93.4,3.3 -120.5,11.6 -23.2,7.1 -26.1,14.3 -26.1,14.3 l 4.8,14.1 c 0,0 5.3,5.4 20.6,9.2 15.3,3.8 53.5,9.7 121.5,9.7 65.3,0 101.6,-6.8 117.5,-10.7 19,-4.6 20.6,-9.5 20.6,-9.5 l 5.4,-15.1 c 0,0 -0.3,-3.7 -23.8,-12.3 -29.1,-10.7 -71.4,-11.4 -120,-11.4 z m -1.8,18.4 a 129.7,15 0 0 1 129.7,15 129.7,15 0 0 1 -129.7,15 129.7,15 0 0 1 -129.7,-15 129.7,15 0 0 1 129.7,-15 z"/>
      <path id="main" fill="currentColor"
            d="M 104.2,413.6 20,173.9 c 0,0 98.9,129.1 151.9,111 54.2,-18.5 85,-233.8 85,-233.8 0,0 33,224.7 87,234.5 56.7,10.3 149.7,-112.1 149.7,-112.1 L 410.2,411.3 c 0,0 -9.3,-26.2 -151.7,-26.2 -150,0 -154.3,28.5 -154.3,28.5 z"/>
      <path id="spike1" fill="currentColor"
            d="m 119.5,261.9 c 0,0 8.2,-23.1 10.3,-42.7 2.1,-19.5 4.1,-67.4 4.1,-67.4 0,0 21.7,69.2 26.2,78.4 13.2,27 21.5,35.9 21.5,35.9 0,0 -6.5,12.8 -19.8,13.3 -13.4,0.5 -42.3,-17.5 -42.3,-17.5 z"/>
      <path id="spike2" fill="currentColor"
            d="m 382.3,265.8 c 0,0 -5.7,-11.3 -9.2,-30.7 -5.7,-30.8 -6.2,-82.3 -6.2,-82.3 0,0 -19.9,61.6 -24.4,70.8 -13.2,27 -18.4,32.8 -18.4,32.8 0,0 10.6,21.7 24,22.2 13.4,0.5 34.2,-12.8 34.2,-12.8 z"/>
      <circle id="ball1" fill="currentColor" cy="169" cx="21" r="18"/>
      <circle id="ball2" fill="currentColor" cy="154" cx="135" r="15"/>
      <circle id="ball3" fill="currentColor" cy="53" cx="257" r="16"/>
      <circle id="ball4" fill="currentColor" cy="153" cx="367" r="15"/>
      <circle id="ball5" fill="currentColor" cy="169" cx="492" r="18"/>
    </svg>
  `,
  host: {
    style: 'line-height: 0;',
  }
})
export class IconCrownComponent {
  public readonly size = input(24);
}
