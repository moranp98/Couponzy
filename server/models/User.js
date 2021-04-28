class User {
    
    constructor(id, firstName, lastName, email, password, userID, phoneNumber,
        pictureName, birthday, gender, age, maritalStatus, address, lat, long, 
        active, role, permssion, created_at, updated_at){

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userID = userID;
        this.phoneNumber = phoneNumber;
        this.pictureName = pictureName;
        this.birthday = birthday;
        this.gender = gender;
        this.age = age;
        this.maritalStatus = maritalStatus;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.active = active;
        this.role = role;
        this.permssion = permssion;
        this.created_at = created_at;
        this.updated_at = updated_at;
      }
  }
  
  module.exports = User;