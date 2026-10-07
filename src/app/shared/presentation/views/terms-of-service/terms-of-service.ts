import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-of-service',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.scss',
})
export class TermsOfService {
  /** Keys under `terms.sections` in the i18n dictionaries, in reading order. */
  protected readonly sections = [
    'service',
    'accounts',
    'owners',
    'contractors',
    'payments',
    'privacy',
    'ethics',
    'liability',
    'changes',
    'contact',
  ];
}
