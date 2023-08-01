import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { QuoteService } from "src/app/services/quote.service";
@Component({
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.css"],
})
export class DialogBoxComponent implements OnInit {
  @Input() leaseAggrement: any;
  @Output() leaseAggrementOp: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private quoteService: QuoteService,
    private spinner: NgxSpinnerService
  ) {}
  @HostListener("keyup", ["$event"])
  onInput(e: any) {
    const { name, id, value } = e.target;
    if (id && value && this.leaseAggrement.type == 0) {
      let ele: any = document.getElementById(id);
      if (this.leaseAggrement.result.lessee_agrees_to_pay[name]) {
        this.leaseAggrement.result.lessee_agrees_to_pay[name] = value;
      } else {
        let ids = ele.closest("tr");
        console.log(ids);
        let id = ele.closest("tr").id;
        if (id.includes("studio_tr")) {
          let index = id.split("studio_tr_")[1];
          if (index && this.leaseAggrement.result.studio[index]) {
            this.leaseAggrement.result.studio[Number(index)][name] = Number(
              value.replace("$", "")
            );
            // Monthly Rent
            let total = this.leaseAggrement.result.studio
              .map((x) => x.studio_type_rent_per_month)
              .reduce((a, b) => Number(a) + Number(b), 0);
            console.log(total);
            console.log(this.leaseAggrement.result);
            // Monthly Rent

            let delivery_charge_with_tax = this.leaseAggrement.result.studio
              .map(
                (x) =>
                  Number(x.studio_type_total_unit) *
                  Number(x.studio_type_delivery_fees_per_unit)
              )
              .reduce((a, b) => Number(a) + Number(b), 0);

            let pick_up_charge_with_tax = this.leaseAggrement.result.studio
              .map(
                (x) =>
                  Number(x.studio_type_total_unit) *
                  Number(x.studio_type_pickup_fees_per_unit)
              )
              .reduce((a, b) => Number(a) + Number(b), 0);

            let total_with_del = total + delivery_charge_with_tax;
            let tax = (total_with_del * 8.6) / 100;
            let final_total_monthly = tax + total;
            let final_delivery_value = delivery_charge_with_tax + tax;
            let final_pickup_value = pick_up_charge_with_tax + tax;

            // Monthly Rent
            let final_lease_monthly_rent =
              document.getElementById("lease_monthly_rent");
            if (final_lease_monthly_rent) {
              final_lease_monthly_rent.setAttribute(
                "value",
                `$${total.toFixed(2)}`
              );
              this.leaseAggrement.result.lease_monthly_rent = total.toFixed(2);
              this.leaseAggrement.result.lessee_agrees_to_pay.lease_monthly_rent =
                total.toFixed(2);
              this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_monthly_rent =
                total.toFixed(2);
            }
            // Monthly Rent

            // Tax Charge
            let latest_tax = document.getElementById("lease_total_tax_amount");
            if (latest_tax) {
              latest_tax.setAttribute("value", `$${tax.toFixed(2)}`);
              this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_tax_amount =
                tax.toFixed(2);
            }
            // Tax Charge

            // Total monthly rental
            let latest_monthly_rent = document.getElementById(
              "lease_total_monthly_rent"
            );
            if (latest_monthly_rent) {
              latest_monthly_rent.setAttribute(
                "value",
                `$${final_total_monthly.toFixed(2)}`
              );
            }
            // Total monthly rental

            // Delivery and installation Fee
            let latest_delivery_fee = document.getElementById(
              "lease_total_delivery_installation_fees"
            );
            if (latest_delivery_fee) {
              latest_delivery_fee.setAttribute(
                "value",
                `$${final_delivery_value.toFixed(2)}`
              );
              this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_delivery_installation_fees =
                final_delivery_value;
            }
            // Delivery and installation Fee

            // Pickup Fee
            let latest_pick_fee = document.getElementById(
              "lease_total_pickup_fees"
            );
            if (latest_pick_fee) {
              latest_pick_fee.setAttribute(
                "value",
                `$${final_pickup_value.toFixed(2)}`
              );
              this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_pickup_fees =
                final_pickup_value;
            }
            // Pickup Fee
          }
        } else if (id.includes("cat_tr")) {
          let slug = id.split("cat_tr_")[1];
          if (slug && this.leaseAggrement.result.category_qty[slug]) {
            this.leaseAggrement.result.category_qty.qty = value;
          }
        } else if (id.includes("unit_tr")) {
          let index = id.split("unit_tr_")[1];
          if (index && this.leaseAggrement.result.units[index]) {
            this.leaseAggrement.result.units[Number(index)][name] = value;
          }
        }
      }
    }
    if(id&& value && this.leaseAggrement.type == 1){
      console.log(name)
      this.leaseAggrement.result.lessee_agrees_to_pay[id]=value.replace("$", "")
      let buy_tax =  Number(this.leaseAggrement.result.lessee_agrees_to_pay?.lease_monthly_rent) 
        +  Number(this.leaseAggrement.result.lessee_agrees_to_pay?.lease_total_delivery_installation_fees);
     let total_tax = buy_tax * Number(this.leaseAggrement.result.lessee_agrees_to_pay?.lease_tax_percentage)/100;
     console.log(total_tax)
      console.log( this.leaseAggrement.result)
      let lease_total_tax = document.getElementById('lease_total_tax_amount')
      if(lease_total_tax){
        lease_total_tax.setAttribute("value", `$${total_tax.toFixed(2)}`);
        this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_tax_amount = total_tax
      }
      let lease_total_monthly = document.getElementById('lease_total_monthly_rent')
      let total_value:any = Number(this.leaseAggrement.result.lessee_agrees_to_pay?.lease_monthly_rent)
      + Number(this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_tax_amount)
      if(lease_total_monthly){
        lease_total_monthly.setAttribute(
          "value",
          `$${total_value.toFixed(2)}`
        );
        this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_monthly_rent = total_value;
      }
      let lease_total_payment = document.getElementById('lease_total_payment_fees')
      let total_payment = total_value + Number(this.leaseAggrement.result.lessee_agrees_to_pay?.lease_total_delivery_installation_fees)
      if(lease_total_payment){
        lease_total_payment.setAttribute(
          "value",
          `$${total_payment.toFixed(2)}`
        );
        this.leaseAggrement.result.lessee_agrees_to_pay.lease_total_payment_fees = total_payment;
      }
    }
  }
  ngOnInit(): void {
    console.log(this.leaseAggrement);
    if (this.leaseAggrement) {
      this.leaseAggrement.result.html = this._sanitizer.bypassSecurityTrustHtml(
        this.leaseAggrement.result.html
      );
    }
  }
  savePdf(type) {
    if (type == 0) {
      let result = { ...this.leaseAggrement.result };
      delete result.statusCode;
      delete result.html;
      delete result.lessee_agrees_path;
      let obj = {
        quote_id: this.leaseAggrement.result.quote.sgid,
        user_id: this.leaseAggrement.result.quote.userid,
        input_data: result,
      };
      this.updateQuote(obj)
    }
    else if(type == 1){
      let result = { ...this.leaseAggrement.result };
      delete result.statusCode;
      delete result.html;
      delete result.lessee_agrees_path;
      let obj = {
        quote_id: this.leaseAggrement.result.quote.sgid,
        user_id: this.leaseAggrement.result.quote.userid,
        input_data: result,
      };
      this.updateQuote(obj)
    }
  }
  updateQuote(obj){
    this.spinner.show();
    this.quoteService.updateLeaseAgreement(obj).subscribe((res: any) => {
      console.log(res);
      if (res.statusCode == 200) {
        this.spinner.hide();
        this.leaseAggrementOp.emit(res.message);
      }
    });
  }
}
