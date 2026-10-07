import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-content',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.scss',
})
export class FooterContent {
  protected readonly currentYear = new Date().getFullYear();
}
