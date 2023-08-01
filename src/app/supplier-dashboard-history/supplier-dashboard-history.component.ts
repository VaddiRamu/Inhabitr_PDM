import { Component, OnInit } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { DashboardService } from "../services/dashboard.service";
// import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: "app-supplier-dashboard-history",
  templateUrl: "./supplier-dashboard-history.component.html",
  styleUrls: ["./supplier-dashboard-history.component.css"],
  // encapsulation: ViewEncapsulation.None
})
export class SupplierDashboardHistoryComponent implements OnInit {
  supplierList: any;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  p: any;
  selectedSupp: any = 0;
  supplierTData: any;
  filterSelections = [];
  constructor(private DashboardService: DashboardService) {}

  ngOnInit(): void {
   
    this.getSupplierDropdownValues();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "sgid",
      textField: "name",
      allowSearchFilter: true,
      selectAllText: "Select All",
      unSelectAllText: "Select All",
      itemsShowLimit: 0,
      "limitSelection": -1
    };
    this.suppliersList();
  }

  getSupplierDropdownValues() {
    this.DashboardService.getAllActiveSupplier().subscribe((res) => {
      console.log(res);
      this.supplierList = res;
    });
  }
  sortType = 'desc'
  assing(value){
  console.log(value);
  this.sortType = value
  this.suppliersList()
  }

  desing(value){
  console.log(value);
  this.sortType = value
  this.suppliersList()
  }

  suppliersList(){
    this.DashboardService.getTableList(this.selectedSupp, this.sortType).subscribe((data) => {
      this.supplierTData = data.result;
    });
  }
 
  onItemSelect(item: any) {
    this.filterSelections.push(item);
    let selectedSuppValue = this.filterSelections.map((x) => x.sgid);
    this.selectedSupp = selectedSuppValue;
    this.suppliersList()
  }
  onItemDeSelect(item: any) {
    let filterIndex = this.filterSelections.findIndex((x) => x.sgid === item.sgid);
    if (filterIndex != -1) this.filterSelections.splice(filterIndex, 1);
    let selectedSuppValue = this.filterSelections.map((x) => x.sgid);
    this.selectedSupp = selectedSuppValue;
    this.suppliersList()
  }

  onSelectAll(items: any) {
    this.selectedSupp = 0;
    this.suppliersList()
  }

  onUnSelectAll() {
    console.log("onUnSelectAll fires");
  }
}
