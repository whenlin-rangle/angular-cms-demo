import { Component, OnDestroy, OnInit } from "@angular/core";
import { StrapiService } from "./strapi.service";
import { catchError, map, Observable, of, Subject, takeUntil, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AddCarDialogComponent } from "./add-car-dialog/add-car-dialog.component";

export interface Car {
  carId: string | null;
  Make: string;
  Model: string;
  Img: any;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

export interface Entry<T> {
  id: number;
  attributes: T;
}

export interface Response<T> {
  data: Entry<T>[];
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  error: any | undefined;
  cars$: Observable<Car[]> | undefined;
  destroyed$: Subject<void> = new Subject();

  endpointUrl = "http://localhost:1337";

  carForm = new FormGroup({
    make: new FormControl(""),
    model: new FormControl(""),
    image: new FormControl(),
  });

  constructor(
    private strapiService: StrapiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cars$ = this.getCars();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getCars(): Observable<Car[]> {
    return this.strapiService.getCars().pipe(
      takeUntil(this.destroyed$),
      catchError((error) => this.handleError(error)),
      map((response) =>
        response.data.map((x) => {
          x.attributes.carId = x.id.toString();
          return x.attributes;
        })
      )
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error;
    console.error("api error response: ", error);
    return of();
  }

  renderImageURL(car: any): string | null {
    if (car.Img.data === null) return null;

    return this.endpointUrl + car.Img.data.attributes.url;
  }

  onFileSelected(event: Event): void {
    let ele = event.target as HTMLInputElement;
    let file = ele.files![0];

    this.carForm.value.image = file;
  }

  openAddCarDialog(): void {
    const dialogRef = this.dialog.open(AddCarDialogComponent, {});

    dialogRef.afterClosed().subscribe(() => {
      this.cars$ = this.getCars();
    });
  }

  async deleteCar(car: Car): Promise<void> {
    this.strapiService
      .deleteCar(Number(car.carId))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.cars$ = this.getCars();
      });
  }
}
