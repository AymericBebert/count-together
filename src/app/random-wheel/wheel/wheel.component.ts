import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {interpolateString} from 'd3-interpolate';
import {scaleLinear} from 'd3-scale';
import {select, Selection} from 'd3-selection';
import {curveLinearClosed, line, lineRadial} from 'd3-shape';
import 'd3-transition';
import {of, Subject} from 'rxjs';
import {debounceTime, delay, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
  standalone: false,
})
export class WheelComponent implements OnDestroy, OnChanges, AfterViewInit {

  @Input() public names: string[] = [];
  @Input() public nb = 5;
  @Input() public dark = false;
  @Input() public reset = 0;

  @ViewChild('svgRef', {static: true}) public svgRef!: ElementRef<SVGElement>;

  private oldNb = 5;
  private oldAngle = 180;
  private angle = 180;
  private arrowPrepared = false;
  private spinning = false;

  private readonly fontSize = '14px';
  private readonly outerRadiusMargin = 40;
  private readonly redrawDuration = 500;
  private readonly spinDuration = 4000;
  private readonly crownSize = 32;

  private width!: number;
  private middle!: number;
  private far!: number;
  private lastCrown = -1;

  private arrowWrapper!: Selection<any, unknown, null, undefined>;
  private arrowRotate!: Selection<any, unknown, null, undefined>;
  private arrowInner!: Selection<any, unknown, null, undefined>;

  private reset$ = new Subject<void>();
  private resize$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  private arrowPathData: [number, number][] = [
    [0, -0.2], [-0.3, -0.4], [0, 0.8], [0.3, -0.4],
  ];

  private arrowPathDFn = line<[number, number]>()
    .x(d => d[0])
    .y(d => d[1]);

  @HostListener('window:resize')
  public onResize() {
    this.resize$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (this.names.length > 0) {
      this.nb = this.names.length;
      this.onNbChanged();
    } else {
      this.names = new Array(this.nb).fill('').map((_, i) => '' + (i + 1));
    }

    this.prepareArrow();
    this.prepareCrown();

    this.resize$
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSizes();
        this.adjustZones();
        this.adjustArrowPosition();
        this.adjustCrownPosition();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.arrowPrepared) {
      this.updateSizes();
      this.arrowPrepared = true;
    }
    if (changes.reset?.currentValue) {
      this.reset$.next();
      this.adjustArrowReset();
      this.adjustCrownReset();
    }
    if (changes.names?.currentValue) {
      this.nb = this.names.length;
      this.onNbChanged();
      this.adjustZones();
      return;
    }
    if (changes.nb?.currentValue) {
      this.onNbChanged();
      this.names = new Array(this.nb).fill('').map((_, i) => '' + (i + 1));
      this.adjustZones();
      return;
    }
    if (changes.dark) {
      this.adjustZones();
      this.adjustArrowColor();
      return;
    }
  }

  public spin() {
    if (this.spinning) {
      return;
    }
    this.angle = this.angle + 360 * 3 + Math.random() * 360;
    this.spinning = true;
    this.adjustArrowRotate(this.spinDuration);
    this.adjustCrownReset();
    of({nb: this.nb, angle: this.angle}).pipe(
      delay(this.spinDuration),
      takeUntil(this.reset$),
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.oldAngle = this.angle;
      this.spinning = false;
      this.giveCrown(Math.floor((data.angle % 360) * this.nb / 360 + 0.5) % data.nb);
    });
  }

  private onNbChanged(): void {
    if (this.nb !== this.oldNb) {
      this.oldNb = this.nb;
      this.adjustCrownReset();
    }
  }

  private updateSizes() {
    this.width = this.svgRef.nativeElement.getBoundingClientRect().width;

    this.middle = this.width / 2;
    this.far = this.middle - this.outerRadiusMargin;

    select(this.svgRef.nativeElement)
      .attr('height', this.width);
  }

  private adjustZones() {
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
      .attr('class', 'label')
      .attr('transform', centerTransformFn)
      .style('opacity', 1);

    const labelPathDFn = (_: string, i: number) => radarLine([[0, 0], [1, i + 0.5]]);
    const labelColorFn = this.dark ? '#cccccc' : '#444444';

    labelsEnter.append('path')
      .attr('d', labelPathDFn)
      .attr('stroke', labelColorFn)
      .attr('opacity', 0.25)
      .attr('stroke-width', 2);

    const labelTextXFn = (_: string, i: number) => Math.sin((i / this.nb - 0.5) * 2 * Math.PI) * this.far;
    const labelTextYFn = (_: string, i: number) => -Math.cos((i / this.nb - 0.5) * 2 * Math.PI) * this.far;

    labelsEnter.append('text')
      .attr('x', labelTextXFn)
      .attr('y', labelTextYFn)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-size', this.fontSize)
      .style('fill', labelColorFn)
      .text(d => d);

    const labelsUpdate = labelsEnter.merge(labels)
      .transition()
      .duration(this.redrawDuration);

    labelsUpdate
      .attr('transform', centerTransformFn)
      .style('opacity', 1);

    labelsUpdate.select('text')
      .attr('x', labelTextXFn)
      .attr('y', labelTextYFn)
      .style('fill', labelColorFn)
      .text(d => d);

    labelsUpdate.select('path')
      .attr('d', labelPathDFn)
      .attr('stroke', labelColorFn);

    labels
      .exit()
      .transition()
      .duration(this.redrawDuration)
      .style('opacity', 0)
      .attr('transform', `${centerTransformFn} scale(0.2)`)
      .remove();
  }

  private prepareArrow() {
    this.arrowWrapper = select(this.svgRef.nativeElement).select('.arrow-wrapper');
    this.arrowRotate = select(this.svgRef.nativeElement).select('.arrow-rotate');
    this.arrowInner = select(this.svgRef.nativeElement).select('.arrow-inner');

    this.arrowWrapper
      .attr('transform', `translate(${this.middle} ${this.middle}) scale(${this.far})`);

    this.arrowRotate
      .attr('transform', `rotate(${this.angle})`);

    this.arrowInner
      .attr('d', this.arrowPathDFn(this.arrowPathData))
      .attr('fill', this.dark ? '#6648be' : '#2b1963');
  }

  private adjustArrowPosition() {
    this.arrowWrapper
      .transition()
      .duration(this.redrawDuration)
      .attr('transform', `translate(${this.middle} ${this.middle}) scale(${this.far})`);
  }

  private adjustArrowReset() {
    this.arrowWrapper
      .transition()
      .duration(this.redrawDuration / 2)
      .attr('transform', `translate(${this.middle} ${this.middle}) scale(0)`)
      .transition()
      .duration(this.redrawDuration / 2)
      .attr('transform', `translate(${this.middle} ${this.middle}) scale(${this.far})`);

    setTimeout(
      () => {
        this.angle = 180;
        this.oldAngle = 180;
        this.arrowRotate
          .transition()
          .duration(1)
          .attr('transform', `rotate(${this.angle})`);
        this.spinning = false;
      },
      this.redrawDuration / 2);
  }

  private adjustArrowRotate(duration: number) {
    this.arrowRotate
      .transition()
      .duration(duration)
      .attrTween('transform', () => interpolateString(
        `rotate(${this.oldAngle})`,
        `rotate(${this.angle})`,
      ));
  }

  private adjustArrowColor() {
    this.arrowInner
      .transition()
      .duration(this.redrawDuration)
      .attr('fill', this.dark ? '#6648be' : '#2b1963');
  }

  private prepareCrown() {
    select(this.svgRef.nativeElement).select('.crown-wrapper')
      .attr('transform', `translate(${this.middle} ${this.middle})`);

    select(this.svgRef.nativeElement).select('.crown')
      .attr('x', this.middle)
      .attr('y', this.middle)
      .style('opacity', 0);
  }

  private crownXFn(index: number): number {
    return -Math.sin((index / this.nb - 1) * 2 * Math.PI) * this.far - this.crownSize / 2;
  }

  private crownYFn(index: number): number {
    return Math.cos((index / this.nb - 1) * 2 * Math.PI) * this.far - this.crownSize - 6;
  }

  private adjustCrownPosition() {
    select(this.svgRef.nativeElement).select('.crown-wrapper')
      .transition()
      .duration(this.redrawDuration)
      .attr('transform', `translate(${this.middle} ${this.middle})`);

    if (this.lastCrown >= 0) {
      select(this.svgRef.nativeElement).select('.crown')
        .transition()
        .duration(this.redrawDuration)
        .attr('x', () => this.crownXFn(this.lastCrown))
        .attr('y', () => this.crownYFn(this.lastCrown));
    }
  }

  private giveCrown(index: number) {
    this.lastCrown = index;

    select(this.svgRef.nativeElement).select('.crown')
      .attr('x', -this.crownSize / 2)
      .attr('y', -this.crownSize / 2)
      .style('opacity', 0)
      .transition()
      .duration(this.redrawDuration)
      .attr('x', () => this.crownXFn(index))
      .attr('y', () => this.crownYFn(index))
      .style('opacity', 1);
  }

  private adjustCrownReset() {
    this.lastCrown = -1;

    select(this.svgRef.nativeElement).select('.crown')
      .transition()
      .duration(this.redrawDuration / 2)
      .attr('x', -this.crownSize / 2)
      .attr('y', -this.crownSize / 2)
      .style('opacity', 0);
  }
}
