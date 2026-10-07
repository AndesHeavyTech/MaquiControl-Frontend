import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound implements OnInit {
  protected invalidPath = '';
  readonly #route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.invalidPath = this.#route.snapshot.url.map((segment) => segment.path).join('/');
  }
}
