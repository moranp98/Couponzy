class User {
    
    constructor(id, userName, email, password, userID, phoneNumber,
        profile_User, birthday, gender, age, maritalStatus, address, lat, long, 
        active, role, employerId, created_at, lastUpdated){

        this.id = id;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.userID = userID;
        this.phoneNumber = phoneNumber;
        this.profile_User = profile_User;
        this.birthday = birthday;
        this.gender = gender;
        this.age = age;
        this.maritalStatus = maritalStatus;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.active = active;
        this.role = role;
        this.employerId = employerId;
        this.created_at = created_at;
        this.lastUpdated = lastUpdated;
      }
  }

  class lastUser {
    
    constructor(id, userName, email, phoneNumber, profile_User, address, role){

        this.id = id;
        this.userName = userName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.profile_User = profile_User;
        this.address = address;
        this.role = role;
      }
  }
  
  module.exports = User;
  module.exports = lastUser;