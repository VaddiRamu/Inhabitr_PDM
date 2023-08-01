import { AbstractControl, FormGroup } from "@angular/forms";

export class customValidation {
  public static percentageValidation(control: AbstractControl) {
    return control.value && control.value > 100 ? { percentage: true } : null;
  }
  public static EarnoutPercentageValidation(control: AbstractControl) {
    return control.value && control.value > 90
      ? { EarnoutErrorMsg: true }
      : null;
  }
  public static assetLeaseLengthValidation(control: AbstractControl) {
    return control.value && control.value > 30 ? { ErrorMsg: true } : null;
  }
  public static rentLeaseLengthValidation(control: AbstractControl) {
    return control.value && control.value > 30 ? { ErrorMsg: true } : null;
  }
}
