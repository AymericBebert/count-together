import {Component, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';

export interface GameNameDialogData {
  name: string;
}

@Component({
  selector: 'app-game-name-dialog',
  templateUrl: './game-name-dialog.component.html',
  styleUrls: ['./game-name-dialog.component.scss'],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
  ],
})
export class GameNameDialogComponent {
  public readonly ref = inject<MatDialogRef<GameNameDialogComponent, string>>(MatDialogRef);
  private readonly data = inject<GameNameDialogData>(MAT_DIALOG_DATA);

  public readonly name = new FormControl<string>(
    this.data.name,
    {nonNullable: true, validators: [Validators.required]},
  );
}
