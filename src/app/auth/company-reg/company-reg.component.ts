import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/services/company.service';
import {CompanyTypesModel} from 'src/app/models/company-types.model'
import { CountriesModel } from 'src/app/models/countries.model';
import { CountryService } from 'src/services/country.service';
import {FormValidation} from "../../validators/form-validation";
import {RegisterCompanyService} from "../../../services/register-company.service";
import {RegisterCompany} from "../../models/register-company.model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-company-reg',
  templateUrl: './company-reg.component.html',
  styleUrls: ['./company-reg.component.css']
})
export class CompanyRegComponent implements OnInit{

  companyTypes:CompanyTypesModel[] = [];
  countries:CountriesModel[] = [];
  displayMsg : string = "";
  isAccountCreated : boolean = false;
  formValidation:FormValidation = new FormValidation();
  registerCompanyModel:RegisterCompany;
  apiRegComp:RegisterCompanyService;

  constructor(
  private apiCompanyService:CompanyService,
  private apiCountryService:CountryService,
  private apiRegisterCompany:RegisterCompanyService,
  private toastr : ToastrService,
  private router : Router
  ) {
    this.registerCompanyModel = new RegisterCompany();
    this.apiRegComp = apiRegisterCompany; //dependency injections
  }



registerCompany(){
  this.registerCompanyModel.companyName = this.formValidation.name.value;
  this.registerCompanyModel.companyTypeId = this.formValidation.type.value;
  this.registerCompanyModel.email = this.formValidation.email.value;
  this.registerCompanyModel.password = this.formValidation.password.value;
  this.registerCompanyModel.contactNum = this.formValidation.contactNumber.value;
  this.registerCompanyModel.description = this.formValidation.description.value;
  this.registerCompanyModel.countryId = this.formValidation.country.value;
  this.registerCompanyModel.location = this.formValidation.location.value;

  this.apiRegComp.registerCompany(this.registerCompanyModel).subscribe(res =>{
    if(res.isSuccess){
      this.displayMsg = res.message;
      this.isAccountCreated = true;
      this.toastr.success('Registration Successful');
      this.router.navigate(['auth/login']);
    } else if (res.message == 'AlreadyExist'){
      this.displayMsg = 'Already Exist. Try another Email.';
      this.isAccountCreated = false;
    } else {
      this.displayMsg = 'Something Went Wrong';
      this.isAccountCreated = false;
    }
    console.log(res);
  });
}

  onFileSelected(event: any) {
    // debugger;
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      // debugger;
      this.registerCompanyModel.profilePic = reader.result as string;

    };
    reader.readAsArrayBuffer(file);
  }


 getCompanyTypes(){
    this.apiCompanyService.getCompanyTypes().subscribe((res:any)=>{
    this.companyTypes = res;
  })
 }

  getCountries() {
    this.apiCountryService.getCountries().subscribe((res: any) => {
      this.countries = res;
    });
  }


  ngOnInit() {
    this.getCompanyTypes();
    this.getCountries();
  }
}

