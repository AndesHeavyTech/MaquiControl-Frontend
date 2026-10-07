import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected currentLang = 'en';
  protected languages: string[];
  #translate: TranslateService;

  constructor() {
    this.#translate = inject(TranslateService);
    this.currentLang = this.#translate.getCurrentLang() ?? 'en';
    this.languages = [...this.#translate.getLangs()];
  }

  useLanguage(language: string) {
    this.#translate.use(language);
    this.currentLang = language;
  }
}
