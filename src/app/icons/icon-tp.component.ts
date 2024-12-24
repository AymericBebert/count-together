import {Component, input} from '@angular/core';

/* eslint-disable max-len */
@Component({
  selector: 'app-icon-tp',
  template: `
    <!-- eslint-disable max-len -->
    <svg id="tp" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
        d="m 345.1616,111.04145 c 0,0 40.22838,0.14245 77.79344,6.87501 46.84547,8.39583 79.66814,28.43927 79.66814,28.43927 l -27.43423,24.80755 18.67862,24.22384 -18.67862,36.4817 17.51121,19.84604 -11.09044,43.77803 18.67863,32.10389 -23.64014,37.35725 23.35884,38.38404 c 0,0 -33.42433,-7.13773 -65.6776,-10.9498 -34.08314,-4.02835 -89.93481,-6.95347 -89.15425,-6.83151 z"
        id="sheet"/>
      <rect
        style="fill:#fbbbd7"
        id="mid"
        width="321.51071"
        height="279.07187"
        x="24.927212"
        y="120.97398"/>
      <path
        style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
        id="bottom"
        d="m 347.51552,397.70886 a 161.12947,35.278378 0 0 1 -80.56474,30.55197 161.12947,35.278378 0 0 1 -161.12947,0 161.12947,35.278378 0 0 1 -80.564733,-30.55197"/>
      <path
        style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
        d="M 25.5,114.4 V 397.9"
        id="side1"/>
      <path
        style="fill:#fbbbd7;stroke:#535353;stroke-width:8"
        d="m 347.5,114.5 v 283.5"
        id="side2"/>
      <ellipse
        style="fill:#e6a5c2;stroke:#535353;stroke-width:8"
        id="top"
        cx="186.5"
        cy="114.4"
        rx="161"
        ry="35.3"/>
      <ellipse
        style="fill:#a99aa2;stroke:#535353;stroke-width:8"
        id="hole"
        cx="186"
        cy="116"
        rx="55.8"
        ry="10.5"/>
    </svg>
  `,
  host: {
    style: 'line-height: 0;',
  }
})
export class IconTpComponent {
  public readonly size = input(24);
}
