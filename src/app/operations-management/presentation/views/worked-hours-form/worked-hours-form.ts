import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

export interface WorkedHoursSubmission {
  workDate: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
  observations: string | null;
}

/** "Worked Hours Form" per the Operations Management frontend component
 *  diagram: a dumb presentational component, the parent page owns the store. */
@Component({
  selector: 'app-worked-hours-form',
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './worked-hours-form.html',
  styleUrl: './worked-hours-form.scss',
})
export class WorkedHoursForm {
  @Output() readonly recorded = new EventEmitter<WorkedHoursSubmission>();

  protected readonly form = new FormGroup({
    workDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    observations: new FormControl('', { nonNullable: true }),
  });

  protected performSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const totalHours = this.calculateHours(value.startTime, value.endTime);

    if (totalHours <= 0) {
      return;
    }

    this.recorded.emit({
      workDate: new Date(value.workDate),
      startTime: value.startTime,
      endTime: value.endTime,
      totalHours,
      observations: value.observations || null,
    });

    this.form.reset({ workDate: '', startTime: '', endTime: '', observations: '' });
  }

  /** `WorkedHours.calculateHours()` per the class diagram: kept here, at
   *  the point where raw start/end strings turn into a duration, since
   *  that is a one-shot UI calculation rather than behaviour the
   *  immutable `WorkedHours` entity carries (same convention as
   *  `Rental`'s transitions, decided in the store, not on the entity). */
  private calculateHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

    return Math.round((minutes / 60) * 100) / 100;
  }
}
