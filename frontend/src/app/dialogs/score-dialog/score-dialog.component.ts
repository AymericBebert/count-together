import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

export interface ScoreDialogData {
  label: string;
  initial?: number | undefined;
}

export type ScoreDialogResult = number | null;

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss'],
  imports: [
    TranslatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class ScoreDialogComponent {
  protected readonly ref = inject<MatDialogRef<ScoreDialogComponent, ScoreDialogResult>>(MatDialogRef);
  protected readonly data = inject<ScoreDialogData>(MAT_DIALOG_DATA);

  public readonly rawValue = signal<string>(this.data.initial?.toString() ?? '');

  public readonly score = computed<number | null>(() => {
    const rawValue = this.rawValue();

    // Sanitize by only keeping [0-9()×+−]
    const sanitized = rawValue.replace(/[^0-9()×+−]/g, '');

    const evaluated = this.shouldCompute(rawValue) ? this.compute(rawValue) : parseInt(sanitized, 10);
    return isNaN(evaluated) ? null : evaluated;
  });

  public readonly hint = computed<string>(() => {
    const rawValue = this.rawValue();
    const value = this.score();
    return this.shouldCompute(rawValue) ? `= ${value}` : '';
  });

  public press(key: string): void {
    this.rawValue.update(s => {
      if (key === 'backspace') {
        return s.slice(0, -1);
      } else {
        return s + key;
      }
    });
    // small haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  private shouldCompute(raw: string): boolean {
    // Check if the raw value contains any of the operators
    return /[×+−]/.test(raw);
  }

  private compute(raw: string): number {
    const operatorReplaced = raw
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/[+*-]$/, '');

    console.log('Computing:', operatorReplaced);

    try {
      // Using indirect eval and forcing strict mode can make the code much better
      return eval?.('"use strict";\n' + `(${operatorReplaced})`) ?? 0;
    } catch (e) {
      console.log(`Error evaluating ${operatorReplaced}:`, e);
      return 0;
    }
  }
}
