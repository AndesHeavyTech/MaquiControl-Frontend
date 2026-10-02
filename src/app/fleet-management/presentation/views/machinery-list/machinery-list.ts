import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-machinery-list',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.scss',
})
export class MachineryList {}
