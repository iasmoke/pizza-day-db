import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MainService } from '../service/main.service';
import { LoginService } from '../service/login.service';
import * as moment from 'moment';
import { ModalHrComponent } from '../modal-hr/modal-hr.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

export interface DialogData {
  user_name: string,
  value: string,
  row: any

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-main-user-hr',
  templateUrl: './main-user-hr.component.html',
  styleUrls: ['./main-user-hr.component.scss'],
})

export class MainUserHrComponent implements OnInit {

  id_tt: string[];
  dataTable_user_hr = [];

  displayedColumns_user_hr: string[] = [
    'color',
    'fio',
    'position',
    'interview_date',
    'department',
    'number_phone',
    'internship_date',
    'internship_place',
    'rejection_reason',
    'status'

  ];

  dataSource = new MatTableDataSource();
  modal_alert_message: any;
  search:any

  id_person: any;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private mainService: MainService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

    this.mainService.user_hr_get_main_table(this.loginService.user_name).subscribe((res) => {
      this.dataTable_user_hr = JSON.parse(res);
      this.dataSource = new MatTableDataSource(this.dataTable_user_hr);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.mainService.get_id_tt().subscribe(res => {
      this.id_tt = JSON.parse(res)
    })
  }

  get_table_personal() {
    this.mainService.user_hr_get_main_table(this.loginService.user_name).subscribe((res) => {
      this.dataTable_user_hr = JSON.parse(res);
      this.dataSource = new MatTableDataSource(this.dataTable_user_hr);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  get_id_tt() {
    this.mainService.get_id_tt().subscribe(res => {
      this.id_tt = JSON.parse(res)
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.id_tt.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }

  openDialog(row, value): void {
    const dialogRef = this.dialog.open(ModalHrComponent, {
      maxWidth: '500px',
      disableClose: true,
      data: {
        user_name: this.loginService.user_name,
        value: value,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      switch (result) {
        case 'Пользователь добавлен':
          this._snackBar.open(result, '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'alert-style-success'
          });
          this.get_table_personal();
          break;
        case 'Данные обновлены':
          this._snackBar.open(result, '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'alert-style-success'
          });
          this.get_table_personal();
          this.search = ''
          break;
      }
    })
  }

  ngOnInit(): void {

  }


}
