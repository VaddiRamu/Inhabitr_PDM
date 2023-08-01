import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ProjectService } from "../../services/project.service";
import { AuthenticateService } from "../../services/authenticate.service";
import { SharedService } from "../../services/shared.service";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "../../services/items.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { customValidation } from "../custom-validation";
import { DialogboxComponent } from "../dialogbox/dialogbox.component";
declare var $: any;
@Component({
  selector: "app-create-projects",
  templateUrl: "./create-projects.component.html",
  styleUrls: ["./create-projects.component.css"],
})
export class CreateProjectsComponent implements OnInit {
  createProjectForm: UntypedFormGroup;
  companyOptions: boolean = false;
  showCreateForm: any = true;
  companyList: any;
  stateList: any[];
  user_id: any;
  project: any;
  leaseList = [];
  unitsInfo: any = {
    project: "",
    units: [],
    floor_plans: [],
    is_show: false,
    index: 1,
    total_group_percentage: "",
    leftover_budget: "",
    unit_groups: [],
  };
  packageInfo: any = {
    project: "",
    units: [],
    unit_group: [],
    is_show: false,
    index: 2,
  };
  unitGroupInfo = {
    unit_groups: [],
    project: {},
    is_show: false,
  };
  moodboardList: any = {
    moodboars: [],
    moodboard_table: [],
  };
  summaryInfo: any = {
    moodboardItems: [],
    moodboardSummary: {},
    group_summary: [],
    new_group_summary: [],
    is_show: false,
  };
  moodBoardView: any;
  categoryList: any;
  hideForm: any = true;
  dropdownList = [];
  IDropdownSettings: {};
  project_id;
  unitGroupId: any;
  percentageValues = 0;
  groupId: any = [];
  moodboardPackagesInfo: any = {
    unitGroups: [],
    moodBoards: [],
    project: {},
    is_show: false,
  };
  moodboardWiseInfo: any = {
    moodboardCategories: [],
    moodboardInfo: {},
    is_show: false,
  };
  disableButton: boolean = true;
  showAll: any = false;
  moodboardItemsInfo: any = {
    moodboardItems: [],
    moodboardSummary: {},
  };
  updateMoodboardId: any;
  modalRef: NgbModalRef;
  productInfo = {
    productDetail: {},
    skuDetail: [],
  };
  dashBoardData: any;
  updateMbId: any;
  updateUnitGroup: any;
  percentageDistribution: any;
  groupUnitGroup: any;
  unitListShow: any;
  isQuote_btnDisable: boolean = false;
  groupDistribution: any = [];
  groupName: void;
  groupValue: any;
  steps: any;
  swapId: any;
  blueSKu = [
    { sgid: 0, name: "All" },
    { sgid: 1, name: "Student Blue" },
    { sgid: 2, name: "Multifamily Blue" },
    { sgid: 3, name: "B2C Blue" },
    { sgid: 4, name: "Student Housing Blue" },
    { sgid: 5, name: "STR Blue" },
    { sgid: 6, name: "Hotel Blue" },
  ];
  itemValue: any;
  headers: any = [];
  moodBoardList: any = [];
  stepIndex = 1;
  letOverBudge: any = 0;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private authService: AuthenticateService,
    private sharedService: SharedService,
    private toasterService: ToastrService,
    private itemsService: ItemsService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createProjectForm = this.formBuilder.group({
      company_id: ["", Validators.required],
      project_name: ["", Validators.required],
      lease_length: ["", Validators.required],
      total_budget: ["", Validators.required],
      no_of_units: ["", Validators.required],
      state_sgid: ["", Validators.required],
      city_name: ["", Validators.required],
      zipcode: ["", Validators.required],
      earnout_type: ["", Validators.required],
      earnout_multiplier: [""],
      earnout_percentage: [
        "",
        [Validators.required, customValidation.EarnoutPercentageValidation],
      ],
      total_earnout: ["", Validators.required],
      freight_percentage: [""],
      inhabitr_asset_budget_without_freight: ["", Validators.required],
      inhabitr_asset_budget_with_freight: ["", Validators.required],
      total_rent_per_month: ["", Validators.required],
      total_rent: ["", Validators.required],
    });

    this.route.queryParams.subscribe((res: any) => {
      this.project_id = res.id;
      this.steps = res.step;
      if (this.project_id && this.steps == "1") {
        this.getProjectById();
      }
      if (this.project_id && this.steps == "2") {
        this.getUnits(this.project_id);
      }
      if (this.project_id && this.steps == "3") {
        if (!this.unitsInfo?.unit_groups?.length)
          this.getUnits(this.project_id);
        setTimeout(() => {
          this.getUnitGroup();
        }, 1000);
      }
      if (this.project_id && this.steps == "4") {
        if (!this.unitsInfo?.unit_groups?.length)
          this.getUnits(this.project_id);
        setTimeout(() => {
          if (this.unitsInfo?.unit_groups?.length) {
            this.getGroupWiseMoodboardListProjectId();
          }
        }, 1500);
      }
      if (this.project_id && this.steps == "5") {
        if (!this.moodboardPackagesInfo?.unitGroups?.length) {
          this.getGroupWiseMoodboardListProjectId();
          this.getUnits(this.project_id);
        }
        setTimeout(() => {
          this.getSummaryResult();
        }, 1500);
      }
    });
  }

  ngOnInit(): void {
    this.intialLoad();
    // this.dummy();
  }
  intialLoad() {
    this.getCompanyList();
    this.user_id = this.authService.getProfileInfo("userId");
    this.getStateList();
    this.leaseLists();
  }
  // company list
  leaseLists() {
    for (let i = 1; i <= 30; i++) {
      let obj = {
        index: i,
        lease: i,
      };
      this.leaseList.push(obj);
    }
    console.log(this.leaseList);
  }
  getCompanyList() {
    this.projectService.getCompanyList().subscribe(
      (res) => {
        if (res.result) {
          this.companyList = res.result;
        }
      },
      (error) => {}
    );
  }
  // company list

  // state list
  getStateList() {
    this.sharedService.getStates().subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
        }
      },
      (error) => {}
    );
  }
  // state list
  isZipCodeValid() {
    let data = {
      city_name: this.createProjectForm.value.city,
      state_id: this.createProjectForm.value.state,
      zipcode: this.createProjectForm.value.zipcode,
    };
    return this.sharedService.validateZipCode(data).toPromise();
  }

  dummy() {
    this.getUnits(145);
  }
  getProjectById() {
    this.spinner.show();
    this.projectService.getProjectById({ project_id: this.project_id }).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            let project = res?.project;
            if (project) {
              this.createProjectForm.patchValue({
                company_id: project?.company_id,
                project_name: project?.project_name,
                total_budget: project?.total_budget,
                state_sgid: project?.state,
                city_name: project?.city,
                zipcode: project?.zip_code,
                no_of_units: project?.no_of_units,
                earnout_type: project?.earnout_type,
                earnout_percentage: project?.earnout_percentage,
                earnout_multiplier: project?.earnout_percentage / 100,
                lease_length: project?.lease_duration,
                inhabitr_budget: project?.inhabitr_budget,
                total_buy_price: project?.total_buy_price,
                total_rent_per_month: Math.round(project?.rent_per_month),
                total_earnout: project?.earnout_amount,
                freight_percentage: project?.freight_percentage,
                inhabitr_asset_budget_without_freight:
                  project?.inhabitr_asset_budget_without_freight,
                inhabitr_asset_budget_with_freight:
                  project?.inhabitr_asset_budget,
                inhabitr_asset_lease_length: Math.round(
                  project.inhabitr_asset_budget_per_month
                ),
                inhabitr_asset_budget_month: Math.round(
                  project.inhabitr_asset_budget
                ),
                total_rent: Math.round(project.rent_per_month_customer),
              });
            }
            this.showCreateForm = true;
            this.unitsInfo.is_show = false;
            this.showAll = false;
            this.stepIndex = 1;
            this.summaryInfo.is_show = false;
            this.unitGroupInfo.is_show = false;
            this.moodboardPackagesInfo.is_show = false;
            this.moodboardWiseInfo.is_show = false;
          }
        },
        (error) => {}
      );
  }
  // create project form
  async projectForm() {
    // this.isSubmitted = true
    if (this.createProjectForm.valid) {
      this.createProjectForm.value.company_id = Number(
        this.createProjectForm.value.company_id
      );
      this.createProjectForm.value.state_sgid = Number(
        this.createProjectForm.value.state_sgid
      );
      let obj = {
        project_id: this.project_id ? this.project_id : 1,
        user_id: this.user_id,
        ...this.createProjectForm.value,
      };
      if (this.project_id) {
        this.projectService.updateProject(obj).subscribe(
          (res: any) => {
            if (res.statusCode) {
              this.project_id = res.project?.sgid;
              this.router.navigate(["/admin/projects/create"], {
                queryParams: { id: this.project_id, step: "2" },
              });
              this.toasterService.success("Project updated Successfully");
            }
          },
          (error) => {}
        );
      } else {
        this.projectService.createProject(obj).subscribe(
          (res: any) => {
            if (res.statusCode) {
              this.project_id = res.project?.sgid;
              this.router.navigate(["/admin/projects/create"], {
                queryParams: { id: this.project_id, step: "2" },
              });
              this.toasterService.success("Project Created Successfully");
            }
          },
          (error) => {}
        );
      }
    }

    // if (this.createProjectForm.value.zipcode) {
    //   let status = false;
    //   try {
    //     status = await this.isZipCodeValid();
    //   } catch (error) {}

    //   if (!status) {
    //     this.toasterService.warning("ZipCode Invalid");
    //     return;
    //   }
    // }
  }

  getUnits(project_id) {
    this.spinner.show();
    this.projectService.getProjectGroupUnits({ project_id: project_id }).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            if (this.steps == "2") {
              this.unitsInfo = {
                project: res.project,
                units: res.units,
                floor_plans: res.floor_plans,
                is_show: true,
                total_group_percentage: res.total_group_percentage,
                leftover_budget: res.leftover_budget,
                unit_groups: res.unit_groups,
              };
            }
            if (this.steps == "3" || this.steps == "4" || this.steps == "5") {
              this.unitsInfo = {
                project: res.project,
                units: res.units,
                floor_plans: res.floor_plans,
                is_show: false,
                total_group_percentage: res.total_group_percentage,
                leftover_budget: res.leftover_budget,
                unit_groups: res.unit_groups,
              };
            }
            this.showCreateForm = false;
            this.letOverBudge = this.unitsInfo?.leftover_budget;
            this.showAll = true;
            this.disableButton = true;
            if (this.unitsInfo?.total_group_percentage == 100)
              this.disableButton = false;
            if (this.unitsInfo?.project?.quote_id)
              this.isQuote_btnDisable = true;
            this.unitGroupInfo.is_show = false;
            this.moodboardWiseInfo.is_show = false;
            this.moodboardPackagesInfo.is_show = false;
            this.summaryInfo.is_show = false;

            if (
              this.stepIndex == 4 ||
              this.stepIndex == 1 ||
              this.stepIndex == 3
            ) {
              this.stepIndex = 2;
            }
          }
        },
        (error) => {}
      );
    // this.getUnitList(project_id);
  }

  unassignedpop() {
    this.unitsInfo?.project?.unassgined_units != 0
      ? this.unassignPopUp()
      : this.breadCrumbNavigataion("assignMoodboards");
  }
  unassignPopUp() {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let unassignData = {
      content: `"Un-Assigned Units: ${this.unitsInfo.project.unassgined_units}
        ${this.unitsInfo?.project?.unassgined_units > 1 ? "Units" : "Unit"}"`,
      dialogType: "unassignDialog",
    };
    modalRef.componentInstance.unassignIn = unassignData;
    modalRef.componentInstance.unassignOp.subscribe((res) => {
      modalRef.componentInstance.activeModal.close();
      this.breadCrumbNavigataion("assignMoodboards");
    });
  }
  getGroupDistribution(data: any) {
    this.groupValue = true;
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    let DstData = {
      content: "Update Group Percentage Distribution",
      res: data,
      dialogType: "groupBudgetDistribution",
    };
    modalRef.componentInstance.groupDstdata = DstData;
    modalRef.componentInstance.updateGroupDst.subscribe((res) => {
      console.log(res);
      if (res) {
        this.updateGroupDistribution(res);
      }
    });
  }
  updateGroupDistribution(content: any) {
    console.log(content);
    let data = {
      project_id: this.project_id,
      groups: [],
    };

    content?.forEach((x) => {
      data?.groups.push({
        sgid: x?.sgid,
        percentage: x?.percentage_distribution,
      });
    });

    this.projectService.updateGroupDistribution(data).subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (this.groupValue) {
          this.toasterService.success(res.message);
          this.getUnits(this.project_id);
          this.closeModal();
        }
      }
    });
  }
  navigateQuotePage() {
    window.open(
      `${window.origin}/admin/quote/view/${this.unitsInfo?.project?.quote_id}`,
      "_blank"
    );
  }

  getUnitList(project_id) {
    this.projectService
      .getProjectGroupUnitList({ project_id: project_id })
      .subscribe((res: any) => {
        if (res) {
          this.dropdownList = res.units.sort(
            (a: any, b: any) => a.sgid - b.sgid
          );
          this.dropdownList.map((x) => (x.unit_id = `U${x.unit_id}`));
          this.IDropdownSettings = {
            idField: "sgid",
            textField: "unit_id",
            allowSearchFilter: false,
            selectAllText: "Select All",
            unSelectAllText: "Select All",
            singleSelection: false,
          };
        }
      });
  }
  // unit group
  groupDialog() {
    this.getUnitList(this.project_id);
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      const modalRef = this.modalService.open(DialogboxComponent, {
        size: "xl",
        backdrop: "static",
        centered: true,
      });
      let data = {
        content: "Add a Group ",
        res: this.unitsInfo,
        units: this.dropdownList,
        button_text: "Add",
        dialogType: "addGroupDialog",
        leftOverBgt: true,
      };
      modalRef.componentInstance.groupData = data;
      modalRef.componentInstance.groupCreate.subscribe((res) => {
        console.log(res);
        if (res) {
          this.unitGropForm(res, "create");
        }
      });
    }, 1000);
  }
  getUnitGropById(groupData: any) {
    console.log(groupData);
    this.updateUnitGroup = groupData?.sgid;
    this.getUnitList(groupData?.pricing_project_id);
    this.spinner.show();
    setTimeout(() => {
      this.projectService
        .getUnitGropById({
          project_id: groupData?.pricing_project_id,
          group_id: groupData?.sgid,
        })
        ?.subscribe((resp: any) => {
          if (resp.statusCode == 200) {
            this.spinner.hide();
            this.dropdownList = [...this.dropdownList, ...resp?.units];
            this.dropdownList.map((x: any) => {
              if (Number(x.unit_id)) {
                x.unit_id = `U${x.unit_id}`;
              }
            });
            this.dropdownList = this.dropdownList?.sort(
              (a: any, b: any) => a.sgid - b.sgid
            );
            const modalRef = this.modalService.open(DialogboxComponent, {
              size: "xl",
              backdrop: "static",
              centered: true,
            });
            let data = {
              content: "Update a Group ",
              res: { ...resp, ...{ floor_plans: this.unitsInfo?.floor_plans } },
              units: this.dropdownList,
              button_text: "Update",
              dialogType: "addGroupDialog",
              leftOverBgt: false,
            };
            modalRef.componentInstance.groupData = data;
            modalRef.componentInstance.groupCreate.subscribe((res) => {
              if (res) {
                this.unitGropForm(res, "update");
              }
            });
          }
        });
    }, 100);
  }
  deleteGroupDialog(data: any, content: any) {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let gpData = { dialogType: "deleteGroupDialog", res: data, type: content };
    modalRef.componentInstance.gpDeleteData = gpData;
    modalRef.componentInstance.groupDelete.subscribe((res) => {
      if (res.type == "group") {
        modalRef.componentInstance.activeModal.close();
        this.getUnits(res?.sgid);
      }
      if (res.type == "moodboardItem") {
        this.projectService
          .deleteMoodboard({ moodboard_id: res.sgid })
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              modalRef.componentInstance.activeModal.close();
              this.getGroupWiseMoodboardListProjectId();
              this.toasterService.success(
                "Moodboard package succesfully deleted"
              );
            }
          });
      }
      if (res.type == "tableItemList") {
        modalRef.componentInstance.activeModal.close();
        this.mdSummaryTableDelete(res.data?.res);
      }
    });
  }
  unitGropForm(data, type) {
    if (data) {
      data.units = data.units?.map((x) => String(x.sgid)).toString();
      if (type == "update") {
        this.spinner.show();
        this.projectService
          .updateGroup({
            project_id: this.project_id,
            group_id: this.updateUnitGroup,
            ...data,
          })
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.spinner.hide();
              this.getUnits(this.project_id);
            }
            this.closeModal();
          });
      }
      if (type == "create") {
        this.spinner.show();
        this.projectService
          .createGroup({ project_id: this.project_id, ...data })
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.spinner.hide();
              this.getUnits(this.project_id);
            }
            this.closeModal();
          });
      }
    }
  }

  // unit group

  getUnitGroup() {
    this.spinner.show();
    this.projectService
      .getUnitGroup({ project_id: this.project_id })
      .subscribe((res: any) => {
        this.disableButton = true;
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.unitGroupInfo = {
            unit_groups: res.unit_groups,
            project: res.project,
            is_show: true,
          };
        }
        this.unitGroupInfo.unit_groups.forEach((x) => {
          if (x.moodboard_count > 0) {
            this.disableButton = false;
          }
        });
        this.unitsInfo.is_show = false;
        this.showCreateForm = false;
        this.showAll = true;
        this.moodboardPackagesInfo.is_show = false;
        this.summaryInfo.is_show = false;
        if (this.stepIndex == 4 || this.stepIndex == 1 || this.stepIndex == 2) {
          this.stepIndex = 3;
        }
      });
  }
  addMoodboard(data: any) {
    this.unitGroupId = data.unit_group_id ? data.unit_group_id : data.sgid;
    this.groupId = data.sgid;
    this.projectService
      .getUnits({ project_id: this.project_id, group_id: data.sgid })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.packageInfo = {
            project: res.project,
            units: res.units,
            unit_group: res.unit_group,
            is_show: false,
          };
        }
        this.disableButton = false;
        this.unitGroupInfo.is_show = false;
        this.getGroupWiseMoodboardList();
      });
  }
  getCategory(data) {
    this.spinner.show();
    this.projectService.getCategories({ roomtype_id: data }).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.categoryList = res.result;
      },
      (error) => {}
    );
  }

  earnoutMultiplierCalulation() {
    let form = this.createProjectForm.value;
    if (form?.earnout_multiplier) {
      this.createProjectForm.patchValue({
        earnout_percentage: form?.earnout_multiplier * 100,
      });
    }
    this.ProjectBudgetCalulation();
  }
  earnoutPercentageCalulation() {
    let form = this.createProjectForm.value;
    let earnout_multiplier_value = form?.earnout_percentage / 100;
    this.createProjectForm.patchValue({
      earnout_multiplier: earnout_multiplier_value,
    });
    this.ProjectBudgetCalulation();
  }
  ProjectBudgetCalulation() {
    let form = this.createProjectForm.value;
    this.createProjectForm.patchValue({
      freight_percentage: form?.freight_percentage
        ? form?.freight_percentage
        : 0,
    });
    let params = {
      total_budget: form.total_budget,
      earnout_percentage: form.earnout_percentage ? form.earnout_percentage : 0,
      freight_percentage: form.freight_percentage ? form.freight_percentage : 0,
      lease_length: form.lease_length,
    };
    this.spinner.show();
    this.projectService.projectValues(params).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.spinner.hide();
        this.createProjectForm.patchValue({
          total_earnout: res.total_earnout_value,
          inhabitr_asset_budget_with_freight: Math.round(
            res.inhabitr_target_av_after_freight
          ),
          inhabitr_asset_budget_without_freight: Math.round(
            res.inhabitr_target_av_before_freight
          ),
          total_rent_per_month: Math.round(
            res.inhabitr_rent_budget_per_month_for_all_units
          ),
          total_rent: Math.round(
            res.total_rent_budget_per_month_for_all_units_customer_pays
          ),
        });
      }
    });

    if (form.lease_length == "None") {
      this.createProjectForm.patchValue({
        total_rent_per_month: 0,
      });
    }
  }

  earnoutType(data) {
    if (data.target.value == "BO") {
      this.createProjectForm.controls["lease_length"].disable();
    } else {
      this.createProjectForm.controls["lease_length"].enable();
    }
  }

  smoothScroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  mbOptsPopup(data) {
    console.log(data);
    this.unitGroupId = data?.sgid;
    const modalRef = this.modalService.open(DialogboxComponent, {
      backdrop: "static",
      centered: true,
      windowClass: "moodboardOptionsClass",
    });
    let optData = {
      content: "How would you like to add a Moodboard?",
      dialogType: "mbOptDialog",
    };
    modalRef.componentInstance.mbOptIn = optData;
    modalRef.componentInstance.mbOptOp.subscribe((res: any) => {
      if (res.type == "create") {
        modalRef.componentInstance.activeModal.close();
        this.addMbPopUp(null, null, null);
      }
      if (res.type == "copy") {
        modalRef.componentInstance.activeModal.close();
        this.copyMbData();
      }
      if (res.type == "autopackage") {
        modalRef.componentInstance.activeModal.close();
        this.navigateRoomBuilder();
      }
    });
  }
  copyMbData() {
    this.spinner.show();
    this.projectService.getMoodboardList().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.spinner.hide();
        var resultArray = Object.keys(res.result).map((x: any) => {
          let result = res.result[x];
          return result;
        });
        this.copyPopup(resultArray);
      }
    });
  }
  copyPopup(data) {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let copyData = {
      content: "Copy an existing Moodboard",
      dialogType: "copyDialog",
      res: data,
    };
    modalRef.componentInstance.copyIn = copyData;
    modalRef.componentInstance.copyOp.subscribe((res: any) => {
      modalRef.componentInstance.activeModal.close();
      this.navigateMbBudgetDistPopup(res);
    });
  }
  navigateMbBudgetDistPopup(data) {
    let obj = {
      unit_group_id: this.unitGroupId,
      project_id: this.project_id,
      moodboard_name: data?.moodboard_name,
      moodboard_id: data?.sgid,
      moodboard_type_id: data?.moodboard_type_id,
      moodboard_source: data?.moodboard_source,
    };
    this.spinner.show();
    this.projectService.getExistingMoodboard(obj).subscribe((res: any) => {
      console.log(res);
      if (res.statusCode == 200) {
        this.percentageDistribution = res?.moodboards;
        this.spinner.hide();
        this.mdBgtDistPopUp(this.unitGroupId);
        this.getGroupWiseMoodboardListProjectId();
      }
    });
  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  navigateRoomBuilder() {
    this.router.navigate(["/admin/projects/roombuilder"], {
      queryParams: {
        id_category: 4,
        pagenumber: 1,
        pagesize: 10,
        project_id: this.project_id,
        unit_group_id: this.unitGroupId,
        price_type: "rent_price",
      },
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  getGroupWiseMoodboardList() {
    this.projectService
      .getGroupWiseMoodboardList({
        project_id: this.project_id,
        group_id: this.groupId,
      })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          let moodboardInfo = res.unit_groups[0];
          this.moodboardList = res.unit_groups[0];
          // this.MoodboardsUnitsTable= this.moodboardList.moodboard_table
          this.moodBoardView = this.moodboardList?.moodboards;
          let items = [];
          const headers =
            moodboardInfo?.moodboard_table?.map((x) => x.moodboard_name) || [];
          if (moodboardInfo?.moodboard_table?.length) {
            headers.push("Total");
            headers.unshift(" ");
          }
          this.headers = headers;
          let unitsCount =
            moodboardInfo?.moodboard_table[0]?.unit_list.length || 0;
          for (let i = 1; i <= unitsCount; i++) {
            let obj = {
              unit: `Unit ${i}`,
            };
            for (let item of moodboardInfo?.moodboard_table) {
              obj[item.moodboard_name] = item.unit_list[i - 1]?.budget || 0;
            }

            let keys = Object.keys(obj).filter((x) => x != "unit");
            let total = 0;
            for (let key of keys) {
              total = total + Number(obj[key]);
            }
            obj["total"] = total;

            items.push(obj);
          }
          this.moodBoardList = items;
        }
      });
  }
  backToMoodboard() {
    this.moodboardWiseInfo.is_show = false;
    this.moodboardPackagesInfo.is_show = true;
    this.getGroupWiseMoodboardListProjectId();
  }
  getGroupWiseMoodboardListProjectId() {
    this.spinner.show();
    this.disableButton = true;
    this.projectService
      .getGroupWiseMoodboardList({ project_id: this.project_id })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          for (let unit of res.unit_groups) {
            let percentage_distribution = unit.moodboards
              .map((x) => Number(x.percentage_distribution) || 0)
              .reduce((a: any, b: any) => a + b, 0);
            if (
              unit.moodboards.some(
                (x) => Number(x.percentage_distribution) == 0
              ) ||
              percentage_distribution < 100 ||
              percentage_distribution > 100
            ) {
              unit["hide_product_add"] = true;
            }
          }
          this.moodboardPackagesInfo = {
            unitGroups: res.unit_groups,
            project: res.project,
            is_show: true,
          };
          this.unitGroupInfo.is_show = false;
          this.unitsInfo.is_show = false;
          this.showCreateForm = false;
          this.summaryInfo.is_show = false;
          this.showAll = true;
          this.moodboardPackagesInfo?.unitGroups.forEach((x: any) => {
            x.moodboards.some((x) => {
              if (x.added_items > 0) {
                return (this.disableButton = false);
              }
            });
          });
          if (
            this.stepIndex == 4 ||
            this.stepIndex == 1 ||
            this.stepIndex == 2
          ) {
            this.stepIndex = 3;
          }
          this.groupDistribution = this.moodboardPackagesInfo?.unitGroups;
        }
      });
    setTimeout(() => {
      this.groupValue = false;
      this.updateGroupDistribution(this.groupDistribution);
    }, 1000);
  }
  unitList() {
    this.unitListShow = !this.unitListShow;
  }

  keepOrder = (a, b) => {
    return a;
  };
  getMoodboardWiseCategories(data) {
    this.unitGroupId = data.unit_group_id;
    this.updateMbId = data?.sgid;
    this.spinner.show();
    if (data?.category_distribution?.length != 0) {
      this.projectService
        .getMoodboardWiseCategories({
          group_id: data.unit_group_id,
          moodboard_id: data.sgid,
        })
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            this.moodboardWiseInfo = {
              moodboardCategories: res.moodboard_categories,
              moodboardInfo: res.moodboard_info,
              unit_group: res.unit_group,
              is_show: true,
            };
            let unassgined_units = res.unassgined_units;
            this.moodboardWiseInfo.moodboardInfo = {
              ...this.moodboardWiseInfo.moodboardInfo,
              ...{ unassgined_units },
            };
            console.log(this.moodboardWiseInfo.moodboardInfo);
            this.moodboardPackagesInfo.is_show = false;
          }
        });
      this.getMoodboardItems(data.unit_group_id, data.sgid);
    } else {
      this.toasterService.error(
        "Please add categories in moodboard to add items."
      );
    }
  }

  getMoodboardItems(groupId, moodboardId) {
    this.projectService
      .getMoodboardItems({ group_id: groupId, moodboard_id: moodboardId })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.moodboardItemsInfo = {
            moodboardItems: res.moodboard_items,
            moodboardSummary: res.moodboard_summary,
          };
        }
      });
  }
  moodboardDelete(data: any) {
    this.projectService
      .deleteMoodboard({ moodboard_id: data.sgid })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.getGroupWiseMoodboardList();
          this.toasterService.error("Moodboard package succesfully deleted");
        }
      });
  }
  mdBgtDistPopUp(data) {
    this.spinner.show();
    this.unitGroupId = data?.sgid ? data?.sgid : data;
    this.projectService
      .getPercentageDistribution({ group_id: data?.sgid ? data?.sgid : data })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          const modalRef = this.modalService.open(DialogboxComponent, {
            size: "xl",
            backdrop: "static",
            centered: true,
          });
          let dataMb = {
            content: "Update Moodboard Percentage Distribution",
            group_id: data,
            dialogType: "updateMbPerDist",
            resp: res,
          };
          modalRef.componentInstance.mdBgtDistCont = dataMb;
          modalRef.componentInstance.mdBgtDistContOp.subscribe((resp) => {
            modalRef.componentInstance.activeModal.close();
            if (resp.type == "create") {
              this.addMbPopUp(res, null, null);
            }
            if (resp.type === "updateMb") {
              this.percentageDistribution = resp.data;
              this.updatePercentageDistribution();
            }
          });
        }
      });
  }
  addMbPopUp(form, Products, category) {
    let project = this.unitsInfo?.unit_groups.filter(
      (x: any) => x.sgid == this.unitGroupId
    );
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    let data = {
      content: "Create a Moodboard and assign a budget",
      dialogType: "createmd",
      product: Products,
      res: form,
      categories: category,
      gpProject: project[0],
    };
    modalRef.componentInstance.createmdIn = data;
    modalRef.componentInstance.createmdOp.subscribe((resp) => {
      console.log(resp);
      if (resp?.type == "roomId") {
        this.getCategory(resp?.id);
      }
      if (resp?.form?.latest_room_type != "" && resp?.type == "category") {
        modalRef.componentInstance.activeModal.close();
        this.categoryPopUp(this.categoryList, "createMb", resp.form);
      }
      if (resp?.create) {
        console.log(resp?.create);
        resp?.create?.product?.forEach((x) => {
          delete x["selected"], delete x["count"];
          delete x["sgid"];
        });
        let obj = {
          moodboard_name: resp?.create?.res?.latest_moodboard_name,
          room_type: resp?.create?.res?.latest_room_type,
        };
        this.projectService
          .createMoodboard({
            unit_group_id: this.unitGroupId,
            project_id: this.project_id,
            ...obj,
            categories: resp?.create?.product,
          })
          .subscribe(
            (res: any) => {
              if (res) {
                modalRef.componentInstance.activeModal.close();
                this.getGroupWiseMoodboardList();
                this.getGroupWiseMoodboardListProjectId();
                this.mdBgtDistPopUp(this.unitGroupId);
                this.toasterService.success("Moodboard created successfully");
              }
            },
            (error) => {}
          );
      }
    });
  }
  categoryPopUp(res, content, form) {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    let data = {
      content: "Check all the funiture you would like to add.",
      dialogType: "category",
      type: content,
      categoryList: res,
    };
    modalRef.componentInstance.categoryIn = data;
    modalRef.componentInstance.categoryOp.subscribe((res) => {
      console.log(res);
      if (res.data == "createMb") {
        modalRef.componentInstance.activeModal.close();
        this.addMbPopUp(form, res?.configureProducts, res);
      }
      if (res.data == "editMb") {
        let data = [
          ...form.moodboard_info.category_distribution,
          ...res?.configureProducts,
        ];
        form.moodboard_info.category_distribution = data;
        modalRef.componentInstance.activeModal.close();
        this.openEditDialog(form);
      }
      if (res.data == "addItem") {
        let data = [...form, ...res?.configureProducts];
        this.addItemPopup(data);
        modalRef.componentInstance.activeModal.close();
      }
    });
  }
  updatePercentageDistribution() {
    let groupId = this.percentageDistribution.map((x) => x.unit_group_id);
    let data = {
      group_id: groupId[0],
      moodboards: [],
    };

    this.percentageDistribution.forEach((x) => {
      data?.moodboards?.push({
        sgid: x?.sgid,
        percentage: x?.percentage_distribution,
      });
    });
    this.projectService
      .updatePercentageDistribution(data)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.getGroupWiseMoodboardListProjectId();
        }
      });
  }

  eidtMbPopUp(data: any) {
    this.updateMoodboardId = data.sgid;
    this.unitGroupId = data.unit_group_id;
    this.spinner.show();
    this.projectService
      .editMoodboard({ moodboard_id: data.sgid })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.openEditDialog(res);
        }
      });
  }
  openEditDialog(result: any) {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    let dataEditMb = {
      content: "Moodboard Product Budget Distribution",
      dialogType: "EditMb",
      resp: result,
      mbId: this.updateMoodboardId,
    };
    modalRef.componentInstance.updatemdIn = dataEditMb;
    modalRef.componentInstance.updatemdOp.subscribe((res: any) => {
      if (res.type == "categroyPopup") {
        modalRef.componentInstance.activeModal.close();
        this.getCategory("");
        setTimeout(() => {
          this.categoryPopUp(this.categoryList, "editMb", result);
        }, 1500);
      }
      if (res?.type == "updateMb") {
        this.projectService
          .UpdateMoodboard({
            unit_group_id: this.unitGroupId,
            project_id: this.project_id,
            ...res.form,
            categories: res.products,
            moodboard_id: this.updateMoodboardId,
          })
          .subscribe(
            (res: any) => {
              if (res) {
                modalRef.componentInstance.activeModal.close();
                this.getGroupWiseMoodboardList();
                this.getGroupWiseMoodboardListProjectId();
                this.toasterService.success("Moodboard updated successfully");
              }
            },
            (error) => {}
          );
      }
    });
  }

  addItems(data: any) {
    this.updateMbCategory(data);
  }
  updateMbCategory(data: any) {
    this.spinner.show();
    this.projectService
      .updateMoodboardCategory({ moodboard_id: data?.sgid ? data?.sgid : data })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.addItemPopup(res.result);
        }
      });
  }
  addItemPopup(data: any) {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let Items = {
      content: "Add Product / Configure Moodboard percentage breakup",
      dialogType: "addItem",
      resp: data,
      mbId: this.updateMbId,
    };
    modalRef.componentInstance.addItemIn = Items;
    modalRef.componentInstance.addItemOp.subscribe((res: any) => {
      if (res.type == "categroyPopup") {
        modalRef.componentInstance.activeModal.close();
        this.getCategory("");
        setTimeout(() => {
          this.categoryPopUp(this.categoryList, "addItem", res?.product);
        }, 1500);
      }
      if (res.type == "updatecategroy") {
        this.updateMoodboardDistribution(res?.products);
        modalRef.componentInstance.activeModal.close();
      }
    });
  }
  updateMoodboardDistribution(data) {
    this.spinner.show();
    this.projectService.updateMoodboardDistribution({
        moodboard_id: this.updateMbId,
        categories: data,
      }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.toasterService.success(res?.message);
          let obj = {
            unit_group_id: this.unitGroupId,
            sgid: this.updateMbId,
          };
          this.getMoodboardWiseCategories(obj);
        }
      });
  }
  // moodboardBudgetCalulation() {
  //   let form = this.creatMoodboard.value;
  //   let mb_budget = Math.round(
  //     (this.unitBudget * form.budget_percentage) / 100
  //   );
  //   let rent_per_month = Math.round(
  //     mb_budget / Number(this.unitsInfo?.project?.lease_duration)
  //   );

  //   this.creatMoodboard.patchValue({
  //     mb_budget: mb_budget,
  //     rent_per_month: rent_per_month,
  //   });
  // }

  productView(data: any) {
    console.log(data)
    this.dashBoardData = data;
    this.swapId = data?.swap_id;
    const modalRef = this.modalService.open(DialogboxComponent, {
      backdrop: "static",
      centered: true,
      windowClass: "customClass",
    });
    let ProductData = {
      dialogType: "filterDialog",
      res: data,
      item: this.itemValue,
      swapId: data?.swap_id,
    };
    modalRef.componentInstance.filterDataIp = ProductData;
    modalRef.componentInstance.filterDataOp.subscribe((res) => {
      console.log(res);
      if (res.type == "moodboard") {
        modalRef.componentInstance.activeModal.close();
        this.addItemsToMoodboard(res.data);
      }
      if (res.type == "dashboard") {
        modalRef.componentInstance.activeModal.close();
        this.dashboardDetailsPopup(res.data);
      }
    });
  }

  addItemsToMoodboard(data: any) {
    console.log(data);
    let obj = {
      sku_variation_id: data?.sku_variation_id,
      moodboard_id: this.dashBoardData?.unit_group_moodboard_id,
      button_type: 0,
      group_id: this.unitGroupId,
      category_id: this.dashBoardData?.category_id,
      sgid: this.dashBoardData?.sgid,
      size_attr_id: data?.size_attr_id,
      swap_id: this.swapId,
    };
    // let params={
    //   group_id:this.unitGroupId,
    //   moodboard_id:this.dashBoardData?.unit_group_moodboard_id,
    //   category_id:this.dashBoardData?.category_id,
    //   size_attr_id:data?.size_attr_id,
    //   sku_var_id:data?.sku_variation_id
    // }
    // this.projectService.sizeValidation(params).subscribe((res:any)=>{
    //   if(res?.ready_for_add==1){
    //     this.addtoMoodboard(obj);
    //   }
    //   else{
    //     this.toasterService.error(res?.message)
    //   }
    // })
    this.spinner.show();
    this.addtoMoodboard(obj);
  }

  addtoMoodboard(data) {
    this.projectService.addItemsToMoodboard(data).subscribe((res: any) => {
        if (res) {
          this.spinner.hide();
          let data = {
            unit_group_id: this.dashBoardData?.unit_group_id,
            sgid: this.dashBoardData?.unit_group_moodboard_id,
          };
          this.getMoodboardWiseCategories(data);
          this.getMoodboardItems(data.unit_group_id, data.sgid);
          this.closeModal();
          this.toasterService.success("Item added successfully");
        }
      },
      (error) => {}
    );
  }
  dashboardDetailsPopup(data) {
    this.spinner.show();
    this.projectService.getSkuData({ inhabitr_sku: data?.SKU }).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.productInfo = {
            productDetail: res.product_detail,
            skuDetail: res.result,
          };
          this.dashboardDailog();
        }
      },
      (error) => {}
    );
  }
  dashboardDailog() {
    const modalRef = this.modalService.open(DialogboxComponent, {
      backdrop: "static",
      centered: true,
      windowClass: "dashboardPopClass",
    });
    let ProductData = { dialogType: "dashboardDialog", res: this.productInfo };
    modalRef.componentInstance.dashboardDataIp = ProductData;
    modalRef.componentInstance.dashboardDataOp.subscribe((res) => {
      if (res) {
        console.log(res);
        modalRef.componentInstance.activeModal.close();
        this.itemValue = res.item;
        this.productView(this.dashBoardData);
      }
    });
  }

  getPercentageDistribution(data: any, content: any) {
    this.projectService.getPercentageDistribution({ group_id: data?.sgid ? data?.sgid : data }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.percentageDistribution = res.result;
          this.groupUnitGroup = res.unit_group;
          this.groupName = res.unit_group?.group_name.replace("-", "");
          let event = this.percentageDistribution
            .map((x) => Number(x.percentage_distribution))
            .reduce((a, b) => a + b, 0);
          this.percentageValues = event;
          // this.percentageDistributionCalucation();
        }
      });
  }

  getSummaryResult() {
    let moodboardValue;
    this.moodboardPackagesInfo?.unitGroups.forEach((x: any) => {
      x.moodboards.some((x) => {
        if (x.added_items > 0) {
          return (moodboardValue = true);
        }
      });
    });
    if (moodboardValue == true) {
      this.projectSummary();
    }
    if (moodboardValue == false) {
      this.toasterService.error("Please add at least one item to moodboard");
    }
    if (!moodboardValue && this.isQuote_btnDisable) {
      this.projectSummary();
    }
  }
  projectSummary() {
    this.spinner.show();
    this.projectService.getSummaryResult({ project_id: this.project_id }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.summaryInfo = {
            moodboardItems: res.moodboard_items,
            moodboardSummary: res.moodboard_summary,
            new_group_summary: res.moodboard_summary.new_group_summary,
            is_show: true,
          };
          let unassgined_units = res.unassgined_units;
          this.summaryInfo.moodboardSummary = {
            ...this.summaryInfo.moodboardSummary,
            ...{ unassgined_units },
          };
          console.log(this.summaryInfo.moodboardSummary);
          if (
            this.stepIndex == 3 ||
            this.stepIndex == 2 ||
            this.stepIndex == 1
          ) {
            this.stepIndex = 4;
          }
          this.showCreateForm = false;
          this.showAll = true;
          this.moodboardPackagesInfo.is_show = false;
          this.unitGroupInfo.is_show = false;
          this.unitsInfo.is_show = false;
          this.moodboardWiseInfo.is_show = false;
        }
      });
  }
  backtomoodboard() {
    this.summaryInfo.is_show = false;
    this.getGroupWiseMoodboardListProjectId();
  }

  // All Nagivation
  getStep(type) {
    let step: any = "";
    switch (type) {
      case "groupunits":
        step = 2;
        break;
      case "assignMoodboards":
        step = 3;
        break;
      case "moodboards":
        step = 4;
        break;
      case "summary":
        step = 5;
        break;

      default:
        step = 1;
        break;
    }
    return step;
  }
  breadCrumbNavigataion(data: any) {
    this.router.navigate(["/admin/projects/create"], {
      queryParams: { id: this.project_id, step: this.getStep(data) },
    });
  }
  // All Nagivation

  // conver to quote
  quote() {
    this.spinner.show();
    this.projectService.getQuote({ project_id: this.project_id }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          this.toasterService.success(res.result);
          this.router.navigate([`/admin/quote/view/${res?.quote_id}`]);
        }
      });
  }
  // conver to quote

  // mdSummaryTableDelete Records
  mdSummaryTableDelete(data) {
    this.projectService.deleteMoodboardItem({
        moodboard_id: this.updateMbId,
        item_id: data?.sgid,
        group_id: this.unitGroupId,
        sku_variation_id: data?.sku_variation_id,
        category_id: data?.category_id,
      }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.toasterService.success("Item Delete Successfully");
          let data = {
            sgid: this.updateMbId,
            unit_group_id: this.unitGroupId,
          };
          this.getMoodboardWiseCategories(data);
          this.getMoodboardItems(data.unit_group_id, data.sgid);
        }
      });
  }
  // mdSummaryTableDelete Records
}
