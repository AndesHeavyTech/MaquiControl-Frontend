import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #translate = inject(TranslateService);
  #titleKey: string | undefined;

  constructor() {
    super();
    this.#translate.onLangChange.subscribe(() => this.#applyTitle());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.#titleKey = this.buildTitle(snapshot);
    this.#applyTitle();
  }

  #applyTitle(): void {
    if (!this.#titleKey) {
      this.#title.setTitle('MaquiControl');
      return;
    }
    this.#translate.get(this.#titleKey).subscribe((translated: string) => {
      this.#title.setTitle(`${translated} | MaquiControl`);
    });
  }
}
