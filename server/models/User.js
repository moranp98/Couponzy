class User {
    
    constructor(
      id, 
      userName, 
      email, 
      userID, 
      phoneNumber,
      profile_User, 
      birthday, 
      gender, 
      age, 
      maritalStatus, 
      address, 
      lat, 
      lon,    
      active, 
      role, 
      employerId, 
      created_at, 
      lastUpdated){

        this.id = id;
        this.userName = userName;
        this.email = email;
        this.userID = userID;
        this.phoneNumber = phoneNumber;
        this.profile_User = profile_User;
        this.birthday = birthday;
        this.gender = gender;
        this.age = age;
        this.maritalStatus = maritalStatus;
        this.address = address;
        this.lat = lat;
        this.lon = lon;
        this.active = active;
        this.role = role;
        this.employerId = employerId;
        this.created_at = created_at;
        this.lastUpdated = lastUpdated;
      }
  }
  
  module.exports = User;
