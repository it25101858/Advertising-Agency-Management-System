package com.adflow.user.dto;

import com.adflow.user.enums.UserRole;
import java.time.LocalDateTime;

public class UserResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private UserRole role;
    private String phone;
    private String companyName;
    private String status;
    private LocalDateTime createdAt;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Frontend compatibility aliases
    public Integer getId() { return userId; }
    public String getName() { return fullName; }
    public String getCompany() { return companyName; }
}
