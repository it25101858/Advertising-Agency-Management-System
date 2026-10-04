package com.adflow.user.dto;

import com.adflow.user.enums.UserRole;

public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String password;
    private UserRole role;
    private String phone;
    private String companyName;
    private String status;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
