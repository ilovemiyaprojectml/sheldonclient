
import { Injectable } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { first } from 'rxjs/operators';



import { AuthenticationService } from '../_services';
import { pipe } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models';
import { CurrentshiftService } from '../_services/currentshift.service';



import { HttpClient } from '@angular/common/http';
import { constants } from '../core/constants';

 
@Component({
  selector: 'miya-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup;
  successMessage: string;
  serviceErrors:any = {};
  disp = 'none';
  dispchange = 'none';

  

  constructor(private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authservice: AuthenticationService,
  private cookieService: CookieService,
  private currentShift: CurrentshiftService,
  private http: HttpClient
  ) { }

  ngOnInit() {
     this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          email: ['', [Validators.required, Validators.email, Validators.maxLength(75)]],
          password: ['', Validators.required],
          newpassword: ['', Validators.compose([
       		Validators.required,
         	UserLoginComponent.patternValidator(/\d/, { hasNumber: true }),
         	UserLoginComponent.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
         	UserLoginComponent.patternValidator(/[a-z]/, { hasSmallCase: true }),
         	UserLoginComponent.patternValidator(new RegExp("(?=.*[!@#$%^&*])"), { hasSpecialCharacters: true }),
         	Validators.minLength(8)])],
          confirmnewpassword: ['', Validators.required]
     });

    
  }
  
  get formValues(){
    return this.loginForm.controls;
  }
  
  resetpassword(event) {
  	
  this.loginForm.reset();
  this.disp = 'block';
  
  
   //console.log(event.target.id); 
}

	changepassword(event) {
	  	
	  this.loginForm.reset();
	  this.dispchange = 'block';
	  
	  
	   //console.log(event.target.id); 
	}
	
	cancelchangepassword(event) {
	this.loginForm.reset();
	  this.dispchange = 'none';
	   //console.log(event.target.id); 
	}
	

cancelresetpassword(event) {
this.loginForm.reset();
  this.disp = 'none';
   //console.log(event.target.id); 
}



	proceedchangepassword(event) {
	
	
	
		if(this.formValues.username.invalid || this.formValues.password.invalid || this.formValues.newpassword.invalid || this.formValues.confirmnewpassword.invalid)
	  	{
	  		if(this.formValues.username.invalid)
	  		{
	  			alert("Invalid Username!");
	  		} else if (this.formValues.password.invalid) {
	  			alert("Invalid Password!");
	  		} else if (this.formValues.newpassword.invalid) {
	  			alert("Invalid New Password!");
	  		} else if (this.formValues.confirmnewpassword.invalid) {
	  			alert("Invalid Confirm New Password!");
	  		}
	  		return;
	  	}
	  	else
	  	{
	  		if (this.formValues.newpassword.value != this.formValues.confirmnewpassword.value) {
	  			alert("New Password and Confirm New Password does not match!"); // add meaningful alert later!
	  			return;
	  		}
	
	  		let data: any = Object.assign(this.loginForm.value);
	  		
	  		
	
	  		this.http.post(`${constants.API_URL}/users/changepassword`, data).subscribe((data:any) => {
	  			if (data.msg == 'Change Password successful!') {
	  				alert(data.msg);
	  				 //setTimeout(() => {
			  			location.reload();
			          //}, 3000);
	  			} else {
	  				alert(data.msg); 
	  			}
	  		
	          /*setTimeout(() => {
	  			location.reload();
	          }, 3000);*/
		      
		    }, error =>
		    {
		    	alert('Change Password failed!'); 
	        });
	  	}
		//this.loginForm.reset();
	  //this.dispchange = 'none';
	}

	proceedresetpassword(event) {

		if(this.formValues.email.invalid)
	  	{
	  		alert("Invalid Email!"); // add meaningful alert later!
	  		return;
	  	}
	  	else
	  	{
	
	  		let data: any = Object.assign(this.loginForm.value);
	
	  		this.http.post(`${constants.API_URL}/users/resetpassword`, data).subscribe((data:any) => {
	  		
	  			if (data.msg == 'Reset Password successful!' || data.msg == 'Reset Password successful, but failed to email the password!') {
	  				alert(data.msg); 
	  				setTimeout(() => {
			  			location.reload();
			          }, 3000);
	  			} else {
	  				alert(data.msg); 
	  			}
	  		
	          /*setTimeout(() => {
	  			location.reload();
	          }, 3000);*/
		      
		    }, error =>
		    {
		    	alert('Reset Password failed!'); 
	        });
	  	}
			this.loginForm.reset();
		  	this.disp = 'none';
		   //console.log(event.target.id); 
		}



  onSubmit(){

    let user = new User(this.formValues.username.value, this.formValues.password.value, this.formValues.password.value, this.formValues.email.value);
    
    if(this.formValues.username.invalid || this.formValues.password.invalid){
      alert("Username or Password is Invalid!"); // add meaningful alert later!
      return;
    }
    this.authservice.login(user)
    .pipe(first())
    .subscribe(
      data => {
		//let currentUser = JSON.parse(localStorage.getItem('currentUser'));
	
        var currentUser;
        var role;
        try {
			currentUser = JSON.parse(this.cookieService.get('currentUser'));
			role = currentUser.role;
			//alert(role);
			if (currentUser.msg == '') {
				if ((role.indexOf('roleCd=EMPLOYEE')> -1 || role.indexOf('roleCd=ADMIN')> -1) && role.indexOf('roleCd=MANAGER') == -1){
				//alert("This account is EMPLOYEE");
				this.currentShift.checkCurrentShift(currentUser.userId)
				.pipe()
				.subscribe(data =>{
		
					if(data.data === "No current shift for this user"){
					var confirmation = confirm("Do you want to create shift?");
					if(confirmation == true){
						this.router.navigate(['/newshift']);
					}
					else{
						this.router.navigate(['/user-dashboard']);
					}
					}
					else{
					this.router.navigate(['/user-dashboard']);
					}
					
				});
			
				//this.router.navigate(['/user-dashboard']);
				}
				else if (role.indexOf('roleCd=MANAGER')> -1){
					//alert("This account is MANAGER");
				  
	        if (role.indexOf('roleCd=EMPLOYEE') == -1) {
	          //"No Own Shift Roles. Redirecting to root-dashboard"
	          this.router.navigate(['/root-dashboard']);
	          return;
	        }
	          
					this.currentShift.checkCurrentShift(currentUser.userId)
					.pipe()
					.subscribe(data =>{
			
						if(data.data === "No current shift for this user"){
							var confirmation = confirm("Do you want to create shift?");
							if(confirmation == true){
								this.router.navigate(['/newshift']);
							}
							else{
								this.router.navigate(['/root-dashboard']);
							}
						}
						else{
							this.router.navigate(['/root-dashboard']);
						}
						
					});
				
					//this.router.navigate(['/user-dashboard']);
					}
				} else {
					alert(currentUser.msg);
					this.loginForm.reset();
					
					if (currentUser.msg == 'Please change your temporary password first! Click the "Change Password" link!') {
						this.dispchange = 'block';
					}
				  }

		} catch(e) {
			alert(e); // error in the above string (in this case, yes)!
	            
	        }
        
		});
  }
  
  
  
  
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
	  return (control: AbstractControl): { [key: string]: any } => {
	    if (!control.value) {
	      // if control is empty return no error
	      return null;
	    }
	
	    // test the value of the control against the regexp supplied
	    const valid = regex.test(control.value);
	
	    // if true, return no error (no error), else return error passed in the second parameter
	    return valid ? null : error;
	  };
	}
  
  


}

  

  



