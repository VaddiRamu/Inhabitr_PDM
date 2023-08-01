import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-no-inventory',
  templateUrl: './no-inventory.component.html',
  styleUrls: ['./no-inventory.component.css']
})
export class NoInventoryComponent implements OnInit {

  noInventorySelected: string;

  noInventoryAttr = [
    {name: 'Inhabitr Inv is 0', value: 'inhabitr'},
    {name: 'Supplier Inv is 0', value: 'supplier'},
    {name: 'Either Inhabitr Inv or Supplier Inv is 0', value: 'all'},
    {name: 'Both Inhabitr Inv or Supplier Inv are 0', value: 'both'}
  ];

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    if (localStorage.getItem('noInventoryFilter')) {
      this.noInventorySelected = localStorage.getItem('noInventoryFilter');
    }
  }

  switchProductMode() {
    localStorage.setItem('noInventoryFilter', this.noInventorySelected);
    this.toastr.success('Mode applied sucessfully.');
  }

  clearProductMode() {
    this.noInventorySelected = null;
    localStorage.removeItem('noInventoryFilter');
    this.toastr.success('Mode removed sucessfully.');
  }
}
