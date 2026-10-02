import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-content',
  imports: [],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.scss',
})
export class FooterContent {
  protected readonly currentYear = new Date().getFullYear();
}
