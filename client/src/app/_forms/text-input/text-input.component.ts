import { Component, Input, Self, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})

export class TextInputComponent implements ControlValueAccessor {
  @Self() ngControl = inject(NgControl);
  @Input() label = '';
  @Input() type = 'text';


  constructor() {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }

  get control(): FormControl{
    return this.ngControl.control as FormControl;
  }

}
