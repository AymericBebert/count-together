import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ShareButtonComponent {
  @Input() public title = 'Count Together';
  @Input() public text = 'Game link';
  @Input() public url = '';
  @Input() public disabled = false;
  @Input() public iconOnly = false;

  public canShare = false;

  private readonly webNavigator: any = null;

  constructor(private snackBar: MatSnackBar,
              private translateService: TranslateService,
  ) {
    this.webNavigator = window.navigator;
    this.canShare = this.webNavigator !== null && this.webNavigator.share !== undefined;
  }

  public shareClicked() {
    if (this.canShare) {
      this.webNavigator.share({
        title: this.title,
        text: this.text,
        url: this.url,
      });
    }
  }

  public copyToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.translateService.get('share.copied').subscribe(t =>
      this.snackBar.open(`${t} ${this.url}`, '', {duration: 3000})
    );
  }

  public activate() {
    if (this.disabled) {
      this.translateService.get('share.disabled').subscribe(t =>
        this.snackBar.open(t, '', {duration: 3000})
      );
      return;
    }
    return this.canShare ? this.shareClicked() : this.copyToClipboard();
  }
}
