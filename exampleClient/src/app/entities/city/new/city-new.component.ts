import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CityService } from '../city.service';
import { ICity } from '../icity';
import { Globals, BaseNewComponent, PickerDialogService, ErrorService } from 'src/app/common/shared';
import { GlobalPermissionService } from 'src/app/core/global-permission.service';

import { CountryService } from 'src/app/entities/country/country.service';

@Component({
  selector: 'app-city-new',
  templateUrl: './city-new.component.html',
  styleUrls: ['./city-new.component.scss'],
})
export class CityNewComponent extends BaseNewComponent<ICity> implements OnInit {
  title: string = 'New City';
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CityNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public global: Globals,
    public pickerDialogService: PickerDialogService,
    public cityService: CityService,
    public errorService: ErrorService,
    public countryService: CountryService,
    public globalPermissionService: GlobalPermissionService
  ) {
    super(formBuilder, router, route, dialog, dialogRef, data, global, pickerDialogService, cityService, errorService);
  }

  ngOnInit() {
    this.entityName = 'City';
    this.setAssociations();
    super.ngOnInit();
    this.setForm();
    this.checkPassedData();
    this.setPickerSearchListener();
  }

  setForm() {
    this.itemForm = this.formBuilder.group({
      city: ['', Validators.required],
      cityId: ['', Validators.required],
      lastUpdate: ['', Validators.required],
      lastUpdateTime: ['12:00 AM', Validators.required],
      countryId: ['', Validators.required],
      countryDescriptiveField: ['', Validators.required],
    });

    this.fields = [
      {
        name: 'city',
        label: 'city',
        isRequired: true,
        isAutoGenerated: false,
        type: 'string',
      },
      {
        name: 'cityId',
        label: 'city Id',
        isRequired: true,
        isAutoGenerated: false,
        type: 'number',
      },
      {
        name: 'lastUpdate',
        label: 'last Update',
        isRequired: true,
        isAutoGenerated: false,
        type: 'date',
      },
      {
        name: 'lastUpdateTime',
        label: 'last Update Time',
        isRequired: true,
        isAutoGenerated: false,
        type: 'time',
      },
    ];
  }

  setAssociations() {
    this.associations = [
      {
        column: [
          {
            key: 'countryId',
            value: undefined,
            referencedkey: 'countryId',
          },
        ],
        isParent: false,
        table: 'country',
        type: 'ManyToOne',
        service: this.countryService,
        label: 'country',
        descriptiveField: 'countryDescriptiveField',
        referencedDescriptiveField: 'countryId',
      },
    ];
    this.parentAssociations = this.associations.filter((association) => {
      return !association.isParent;
    });
  }

  onSubmit() {
    let city = this.itemForm.getRawValue();
    city.lastUpdate = this.dataService.combineDateAndTime(city.lastUpdate, city.lastUpdateTime);
    delete city.lastUpdateTime;
    super.onSubmit(city);
  }
}
