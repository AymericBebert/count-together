import {Component, input} from '@angular/core';

/* eslint-disable max-len */
@Component({
  selector: 'app-icon-tp',
  template: `
    <!-- eslint-disable max-len -->
    <svg id="tp" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path id="sheet" style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
            d="m 345.16,111.04 c 0,0 40.23,0.14 77.79,6.88 46.85,8.4 79.67,28.44 79.67,28.44 l -27.43,24.81 18.68,24.22 -18.68,36.48 17.51,19.85 -11.09,43.78 18.68,32.1 -23.64,37.36 23.36,38.38 c 0,0 -33.42,-7.14 -65.68,-10.95 -34.08,-4.03 -89.93,-6.95 -89.15,-6.83 z"/>
      <rect id="mid" style="fill:#fbbbd7" width="321.51" height="279.07" x="24.93" y="120.97"/>
      <path id="bottom" style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
            d="m 347.52,397.71 a 161.13,35.28 0 0 1 -80.56,30.55 161.13,35.28 0 0 1 -161.13,0 161.13,35.28 0 0 1 -80.56,-30.55"/>
      <path id="side1" style="fill:#fbbbd7;stroke:#535353;stroke-width:8" d="M 25.5,114.4 V 397.9"/>
      <path id="side2" style="fill:#fbbbd7;stroke:#535353;stroke-width:8" d="m 347.5,114.5 v 283.5"/>
      <ellipse id="top" style="fill:#e6a5c2;stroke:#535353;stroke-width:8" cx="186.5" cy="114.4" rx="161" ry="35.3"/>
      <ellipse id="hole" style="fill:#a99aa2;stroke:#535353;stroke-width:8" cx="186" cy="116" rx="55.8" ry="10.5"/>
    </svg>
  `,
  host: {
    style: 'line-height: 0;',
  }
})
export class IconTpComponent {
  public readonly size = input(24);
}
