import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {interpolateString} from 'd3-interpolate';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {curveLinearClosed, lineRadial, line} from 'd3-shape';
import 'd3-transition';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() public names: string[] = [];
  @Input() public nb = 5;
  @Input() private dark = false;

  private oldAngle = 180;
  private angle = 180;
  private spinning = false;

  private destroy$ = new Subject<void>();

  public readonly fontSize = '14px';
  private readonly outerRadiusMargin = 40;
  private readonly redrawDuration = 500;
  private readonly spinDuration = 3000;

  @ViewChild('svgRef', {static: true}) public svgRef: ElementRef<SVGElement>;
  private width: number;
  private height: number;
  private middle: number;
  private far: number;

  private onResize$ = new Subject<void>();

  private arrowPathData: [number, number][] = [
    [0, -0.2], [-0.3, -0.4], [0, 0.8], [0.3, -0.4],
  ];

  private arrowPathDFn = line<[number, number]>()
    .x(d => d[0])
    .y(d => d[1]);

  @HostListener('window:resize')
  public onResize() {
    this.onResize$.next();
  }

  constructor() {
  }

  ngOnInit(): void {
    this.prepareDraw();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.onResize$
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.prepareDraw();
        this.draw();
      });

    if (this.names.length > 0) {
      this.nb = this.names.length;
    } else {
      this.names = new Array(this.nb).fill('').map((_, i) => '' + (i + 1));
    }

    this.prepareDraw();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepareDraw();
    if (changes.names?.currentValue) {
      this.nb = this.names.length;
      this.draw();
      return;
    }
    if (changes.nb?.currentValue) {
      this.names = new Array(this.nb).fill('').map((_, i) => '' + (i + 1));
      this.draw();
      return;
    }
    if (changes.dark) {
      this.draw();
      return;
    }
  }

  public spin() {
    if (!this.spinning) {
      this.angle = this.angle + 360 * 3 + Math.random() * 360;
      this.draw();
      this.spinning = true;
      setTimeout(() => {
        this.spinning = false;
        this.oldAngle = this.angle;
      }, this.spinDuration);
    }
  }

  private prepareDraw() {
    this.width = this.svgRef.nativeElement.getBoundingClientRect().width;
    // noinspection JSSuspiciousNameCombination
    this.height = this.width;

    this.middle = this.width / 2;
    this.far = this.middle - this.outerRadiusMargin;

    select(this.svgRef.nativeElement)
      .attr('height', this.height);
  }

  private draw() {
    const radianAngleScale = scaleLinear<number, number>()
      .domain([0, this.names.length])
      .range([-Math.PI, Math.PI]);

    const radiusScale = scaleLinear<number, number>()
      .domain([0, 1])
      .range([0, this.far]);

    const radarLine = lineRadial<[number, number]>()
      .curve(curveLinearClosed)
      .radius(d => radiusScale(d[0]))
      .angle(d => radianAngleScale(d[1]));

    const centerTransformFn = `translate(${this.middle} ${this.middle})`;

    // ----- SEPARATIONS -----

    const labels = select(this.svgRef.nativeElement).select('.labels')
      .selectAll<SVGGElement, string>('.label')
      .data(this.names);

    const labelsEnter = labels.enter()
      .append('g')
      .attr('transform', centerTransformFn)
      .attr('class', 'label');

    const labelPathDFn = (d, i) => radarLine([[0, 0], [1, i + 0.5]]);
    const labelColorFn = this.dark ? '#cccccc' : '#444444';

    labelsEnter.append('path')
      .attr('d', labelPathDFn)
      .attr('stroke', labelColorFn)
      .attr('opacity', 0.25)
      .attr('stroke-width', 2);

    const labelTextXFn = (d, i) => {
      return Math.sin(radianAngleScale(i)) * (radiusScale(0.85) + this.outerRadiusMargin * 0.45);
      // const ratio = Math.sin(radianAngleScale(i));
      // return (ratio - 0.1 * ratio * ratio * ratio) * (radiusScale(maxValue) + this.outerRadiusMargin * 0.45);
    };
    const labelTextYFn = (d, i) => -Math.cos(radianAngleScale(i)) * (radiusScale(0.85) + this.outerRadiusMargin * 0.3);

    labelsEnter.append('text')
      .attr('x', labelTextXFn)
      .attr('y', labelTextYFn)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-size', this.fontSize)
      .style('fill', labelColorFn)
      // .style('text-shadow', '0 0 10px white, 0 0 10px white')
      .text(d => d);

    const labelsUpdate = labelsEnter.merge(labels)
      .transition()
      .duration(this.redrawDuration);

    labelsUpdate
      .attr('transform', centerTransformFn);

    labelsUpdate.select('text')
      .attr('x', labelTextXFn)
      .attr('y', labelTextYFn)
      .style('fill', labelColorFn)
      .text(d => d);

    labelsUpdate.select('path')
      .attr('d', labelPathDFn)
      .attr('stroke', labelColorFn);

    labels.exit().remove();

    // ----- ARROW -----

    const arrows = select(this.svgRef.nativeElement).select('.arrows')
      .selectAll<SVGGElement, string>('.arrow')
      .data([this.angle]);

    const arrowsEnter = arrows.enter()
      .append('g')
      .attr('transform', centerTransformFn)
      .attr('class', 'arrow');

    const arrowTransformFn = `rotate(${this.angle}) scale(${this.far})`;
    const arrowColorFn = this.dark ? '#6648be' : '#2b1963';

    arrowsEnter.append('path')
      .attr('d', this.arrowPathDFn(this.arrowPathData))
      .attr('transform', arrowTransformFn)
      .attr('fill', arrowColorFn);

    const arrowsUpdate = arrowsEnter.merge(arrows)
      .transition()
      .duration(this.spinDuration);

    arrowsUpdate
      .attr('transform', centerTransformFn);

    arrowsUpdate.select('path')
      .attrTween('transform', () => interpolateString(
        `rotate(${this.oldAngle}) scale(${this.far})`,
        `rotate(${this.angle}) scale(${this.far})`,
      ))
      .attr('fill', arrowColorFn);

    arrows.exit().remove();
  }

  // private drawSpin() {
  //   const radianAngleScale = scaleLinear<number, number>()
  //     .domain([0, this.names.length])
  //     .range([-Math.PI, Math.PI]);
  //
  //   const radiusScale = scaleLinear<number, number>()
  //     .domain([0, 1])
  //     .range([0, this.far]);
  //
  //   const radarLine = lineRadial<[number, number]>()
  //     .curve(curveLinearClosed)
  //     .radius(d => radiusScale(d[0]))
  //     .angle(d => radianAngleScale(d[1]));
  //
  //   const centerTransformFn = `translate(${this.middle} ${this.middle})`;
  //
  //   // ----- SEPARATIONS -----
  //
  //   const labels = select(this.svgRef.nativeElement).select('.labels')
  //     .selectAll<SVGGElement, string>('.label')
  //     .data(this.names);
  //
  //   const labelsEnter = labels.enter()
  //     .append('g')
  //     .attr('transform', centerTransformFn)
  //     .attr('class', 'label');
  //
  //   const labelPathDFn = (d, i) => radarLine([[0, 0], [1, i + 0.5]]);
  //   const labelColorFn = this.dark ? '#cccccc' : '#444444';
  //
  //   labelsEnter.append('path')
  //     .attr('d', labelPathDFn)
  //     .attr('stroke', labelColorFn)
  //     .attr('opacity', 0.25)
  //     .attr('stroke-width', 2);
  //
  //   const labelTextXFn = (d, i) => {
  //     return Math.sin(radianAngleScale(i)) * (radiusScale(0.85) + this.outerRadiusMargin * 0.45);
  //     // const ratio = Math.sin(radianAngleScale(i));
  //     // return (ratio - 0.1 * ratio * ratio * ratio) * (radiusScale(maxValue) + this.outerRadiusMargin * 0.45);
  //   };
  //   const labelTextYFn = (d, i) => -Math.cos(radianAngleScale(i)) * (radiusScale(0.85) + this.outerRadiusMargin * 0.3);
  //
  //   labelsEnter.append('text')
  //     .attr('x', labelTextXFn)
  //     .attr('y', labelTextYFn)
  //     .attr('alignment-baseline', 'middle')
  //     .attr('text-anchor', 'middle')
  //     .style('font-size', this.fontSize)
  //     .style('fill', labelColorFn)
  //     // .style('text-shadow', '0 0 10px white, 0 0 10px white')
  //     .text(d => d);
  //
  //   const labelsUpdate = labelsEnter.merge(labels)
  //     .transition()
  //     .duration(this.redrawDuration);
  //
  //   labelsUpdate
  //     .attr('transform', centerTransformFn);
  //
  //   labelsUpdate.select('text')
  //     .attr('x', labelTextXFn)
  //     .attr('y', labelTextYFn)
  //     .style('fill', labelColorFn)
  //     .text(d => d);
  //
  //   labelsUpdate.select('path')
  //     .attr('d', labelPathDFn)
  //     .attr('stroke', labelColorFn);
  //
  //   labels.exit().remove();
  //
  //   // ----- ARROW -----
  //
  //   const arrows = select(this.svgRef.nativeElement).select('.arrows')
  //     .selectAll<SVGGElement, string>('.arrow')
  //     .data([this.angle]);
  //
  //   const arrowsEnter = arrows.enter()
  //     .append('g')
  //     .attr('transform', centerTransformFn)
  //     .attr('class', 'arrow');
  //
  //   const arrowTransformFn = `rotate(${this.angle}) scale(${this.far})`;
  //   const arrowColorFn = this.dark ? '#6648be' : '#2b1963';
  //
  //   arrowsEnter.append('path')
  //     .attr('d', this.arrowPathDFn(this.arrowPathData))
  //     .attr('transform', arrowTransformFn)
  //     .attr('fill', arrowColorFn);
  //
  //   const arrowsUpdate = arrowsEnter.merge(arrows)
  //     .transition()
  //     .duration(this.spinDuration);
  //
  //   arrowsUpdate
  //     .attr('transform', centerTransformFn);
  //
  //   arrowsUpdate.select('path')
  //     .attrTween('transform', () => interpolateString(
  //       `rotate(${this.oldAngle}) scale(${this.far})`,
  //       `rotate(${this.angle}) scale(${this.far})`,
  //     ))
  //     .attr('fill', arrowColorFn);
  //
  //   arrows.exit().remove();
  // }
}
