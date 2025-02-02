import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import Compressor from 'compressorjs';
import {DatePipe} from "@angular/common";
import {SkillsService} from "../../../services/skills.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.css']
})
export class UserRegComponent implements OnInit {

  userRegForm: FormGroup | any;
  userRegFormSubmitted = false;

  userTypeList: any[] = [];
  skillsList: any[] = [];
  genderList: any[] = [];
  maritalStatusList: any[] = [];

  object: any = {};


  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private apiSkillService: SkillsService,
    private apiUserService: UserService,
    private router: Router
  ) {
  }

  getSkillList() {
    this.apiSkillService.getSkillNames().subscribe((res) => {
      this.skillsList = res;
    })
  }

  getUserType() {
    this.apiUserService.getUserTypes().subscribe((res) => {
      this.userTypeList = res;
    })
  }

  getGenderType() {
    this.apiUserService.getGenderType().subscribe((res) => {
      this.genderList = res;
    })
  }

  getMaritalStatus() {
    this.apiUserService.getMaritalStatus().subscribe((res) => {
      this.maritalStatusList = res;
    })
  }

  userRegFormValid() {
    this.userRegForm = this.builder.group({
      firstName: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern("[a-zA-Z]{3}.*"),
      ])),
      lastName: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern("[a-zA-z].*"),
      ])),
      email: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern("^[^0-9][\\w.%+-]+@gmail\\.com$")
      ])),

      password: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12)
      ])),
      yearlyExp: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^([0-3]\d{0,1}|[4-9])$/),
      ])),
      about: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(400),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9\s'".,]*[a-zA-Z0-9\s.]$/)
      ])),
      city: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ])),
      contact: this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(15),
        Validators.pattern("[0-9]*"),
      ])),

      userTypeId: this.builder.control('', Validators.required),
      genderId: this.builder.control('', Validators.required),
      maritalStatusId: this.builder.control('', Validators.required),
      skills: this.builder.control([], Validators.required),
      dob: this.builder.control('', Validators.required),
      profilePic: this.builder.control('', Validators.required),
      coverImg: this.builder.control('', Validators.required),
      role: this.builder.control('user', Validators.required)
    });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.1,
        success: (result: File | Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            this.userRegForm.get(fileType).setValue(base64String);
          };
          reader.readAsDataURL(result);
        },
      });
    }
  }

  onSubmit() {
    this.userRegFormSubmitted = true;
    if (this.userRegForm.valid) {
      this.object = this.userRegForm.value;
      const formattedDob = this.datePipe.transform(this.object.dob, 'dd/MM/yyyy');
      debugger
      const requestBody = {
        firstName: this.object.firstName,
        lastName: this.object.lastName,
        email: this.object.email,
        password: this.object.password,
        yearlyExp: this.object.yearlyExp,
        about: this.object.about,
        MaritalStatusId: this.object.status,
        skills: this.object.skills,
        dob: formattedDob,
        city: this.object.city,
        genderId: this.object.gender,
        userTypeId: this.object.userType,
        contact: this.object.contact,
        profilePic: this.object.profilePic,
        coverImg: this.object.coverImg,
        role: this.object.role,
      };
      debugger
      this.apiUserService.registerUser(this.object).subscribe((res: any) => {
        if (res.success) {
          console.log('Request Body:', requestBody);
          this.toastr.success('User Registered Successfully');
          this.userRegForm.reset();
          this.router.navigate(['/auth/login']);
        }
      });

    } else {
      this.toastr.warning('Enter Your Data Correctly First');
    }
  }

  ngOnInit() {
    this.userRegFormValid();
    this.getSkillList();
    this.getUserType();
    this.getMaritalStatus();
    this.getGenderType();
  }

}
