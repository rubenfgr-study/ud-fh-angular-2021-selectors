import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountrySmall } from '../../interfaces/countries.interfaces';
import { CountriesService } from '../../services/countries.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required], []],
    pais: ['', [Validators.required], []],
    frontera: ['', [Validators.required], []],
  });

  // Fill selectors
  regions: string[] = [];
  countries: CountrySmall[] = [];
  frontiers: CountrySmall[] = [];

  // UI
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    /* this.myForm.get('region')?.valueChanges.subscribe((region) => {
      this.countriesService
        .getCountriesByRegion(region)
        .subscribe((countries) => {
          this.countries = countries;
          console.log(this.countries);
        });
    }); */
    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap(() => {
          this.myForm.get('pais')?.reset(''), (this.loading = true);
        }),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.countries = countries;
        this.loading = false;
      });

    this.myForm
      .get('pais')
      ?.valueChanges.pipe(
        tap(() => {
          this.myForm.get('frontera')?.reset(''),
            (this.frontiers = []),
            (this.loading = true);
        }),
        switchMap((code) => this.countriesService.getCountryByCode(code)),
        switchMap((country) =>
          this.countriesService.getFrontiersByCodes(country?.borders || [])
        )
      )
      .subscribe((frontiers) => {
        this.frontiers = frontiers;
        this.loading = false;
      });
  }

  save() {
    console.log(this.myForm.value);
  }
}
