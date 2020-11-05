

// Model class for user login


export class User {

    username: string;
    password: string;
    newpassword: string;
    email: string;
    constructor(eid: string, pass: string, newpass: string, email: string){
        this.username = eid;
        this.password = pass;
        this.newpassword = newpass;
        this.email = email
    }

}
