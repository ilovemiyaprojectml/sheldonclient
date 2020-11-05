export class UserCredentials {

    username: string;
    password: string;
    userId: number;
    firstName: string;
    lastName: string;
    userParentId: number;
    otp: string;
    role: string;
    token: string;
    msg: string;
    constructor(username: string,
		    password: string,
		    userId: number,
		    firstName: string,
		    lastName: string,
		    userParentId: number,
		    otp: string,
		    role: string,
		    token: string,
		    msg: string){
        this.username = username;
        this.password = password;
        this.userId = userId;
	    this.firstName = firstName;
	    this.lastName = lastName;
	    this.userParentId = userParentId;
	    this.otp = otp;
	    this.role = role;
	    this.token = token;
	    this.msg = msg
    }
}
