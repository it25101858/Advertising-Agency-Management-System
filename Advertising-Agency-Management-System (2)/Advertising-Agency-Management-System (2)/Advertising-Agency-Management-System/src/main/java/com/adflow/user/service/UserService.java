package com.adflow.user.service;

import com.adflow.user.dto.UserRequest;
import com.adflow.user.dto.UserResponse;
import com.adflow.user.dto.UserUpdateRequest;
import com.adflow.user.enums.UserRole;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Integer userId);
    List<UserResponse> getUsersByRole(UserRole role);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Integer userId, UserUpdateRequest request);
    void deleteUser(Integer userId);
}
