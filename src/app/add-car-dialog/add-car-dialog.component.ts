import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StrapiService } from "../strapi.service";
import { Subject, catchError, map, takeUntil } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-add-car-dialog",
  templateUrl: "./add-car-dialog.component.html",
  styleUrls: ["./add-car-dialog.component.scss"],
})
export class AddCarDialogComponent implements OnDestroy {
  destroyed$ = new Subject<void>();
  carForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddCarDialogComponent>,
    private strapiService: StrapiService,
    private formBuilder: FormBuilder
  ) {
    this.carForm = formBuilder.group({
      make: ["", Validators.required],
      model: ["", Validators.required],
      image: [""],
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onFileSelected(event: Event): void {
    let ele = event.target as HTMLInputElement;
    let file = ele.files![0];

    this.carForm.value.image = file;
  }

  async onSubmit(): Promise<void> {
    if (this.carForm.invalid) return;

    let data: { [key: string]: any } = {};
    let formData = new FormData();
    data["Make"] = this.carForm.value.make;
    data["Model"] = this.carForm.value.model;
    formData.append(
      "files.Img",
      this.carForm.value.image,
      this.carForm.value.image.name
    );
    formData.append("data", JSON.stringify(data));

    this.strapiService
      .addCar(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        console.log("Entry created successfully:", response);
        this.onCancel();
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
