import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  #accountService = inject(AccountService);
  #toastr = inject(ToastrService);
  #fb = inject(FormBuilder);
  #router = inject(Router);

  @Output()
  cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;


  ngOnInit() {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

  }

  initializeForm() {

    this.registerForm = this.#fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
    /*
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required,this.matchValues('password')]),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next:()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })*/
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
    }
  }

  register() {
    const dob = this.#getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = { ...this.registerForm.value, dateOfBirth: dob };
    this.#accountService.register(values).subscribe({
      next: () => {
        this.#router.navigateByUrl('/members');
      },
      error: error => {
        this.validationErrors = error;
      }
    })
  }
  cancel() {
    this.cancelRegister.emit(false)
  }

  #getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDOB = new Date(dob);
    return new Date(theDOB.setMinutes(theDOB.getMinutes() - theDOB.getTimezoneOffset())).toISOString().slice(0, 10);
  }
}
