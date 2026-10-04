package com.adflow.user.controller;

import com.adflow.auth.dto.AuthResponse;
import com.adflow.auth.dto.LoginRequest;
import com.adflow.auth.dto.RegisterRequest;
import com.adflow.auth.service.AuthService;
import com.adflow.common.ApiResponse;
import com.adflow.user.dto.UserRequest;
import com.adflow.user.dto.UserResponse;
import com.adflow.user.dto.UserUpdateRequest;
import com.adflow.user.enums.UserRole;
import com.adflow.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/users", "/users"})
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(required = false) UserRole role) {
        List<UserResponse> list = (role != null) ? userService.getUsersByRole(role) : userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", userService.createUser(request)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam Map<String, String> params) {
        String action = params.getOrDefault("action", "REGISTER");

        if ("LOGIN".equalsIgnoreCase(action)) {
            LoginRequest req = new LoginRequest();
            req.setEmail(params.get("email"));
            req.setPassword(params.get("password"));
            AuthResponse authRes = authService.login(req);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", authRes));
        }

        if ("REGISTER".equalsIgnoreCase(action)) {
            RegisterRequest req = new RegisterRequest();
            req.setFullName(params.get("fullName"));
            req.setEmail(params.get("email"));
            req.setPassword(params.get("password"));
            req.setPhone(params.get("phone"));
            req.setCompanyName(params.get("companyName"));
            AuthResponse authRes = authService.register(req);
            return ResponseEntity.ok(ApiResponse.ok("Registration successful", authRes));
        }

        if ("SAVE_STAFF".equalsIgnoreCase(action)) {
            String idStr = params.get("id");
            if (idStr == null) idStr = params.get("userId");
            
            if (idStr != null && !idStr.equals("0") && !idStr.isEmpty()) {
                Integer id = Integer.parseInt(idStr);
                UserUpdateRequest uReq = new UserUpdateRequest();
                uReq.setFullName(params.get("fullName"));
                uReq.setEmail(params.get("email"));
                uReq.setPassword(params.get("password"));
                if (params.get("role") != null) uReq.setRole(UserRole.valueOf(params.get("role")));
                uReq.setPhone(params.get("phone"));
                uReq.setCompanyName(params.get("companyName"));
                return ResponseEntity.ok(ApiResponse.ok("Staff updated", userService.updateUser(id, uReq)));
            } else {
                UserRequest req = new UserRequest();
                req.setFullName(params.get("fullName"));
                req.setEmail(params.get("email"));
                req.setPassword(params.get("password") != null ? params.get("password") : "Default@123");
                req.setRole(params.get("role") != null ? UserRole.valueOf(params.get("role")) : UserRole.CREATIVE_STAFF);
                req.setPhone(params.get("phone"));
                req.setCompanyName(params.get("companyName"));
                return ResponseEntity.ok(ApiResponse.ok("Staff created", userService.createUser(req)));
            }
        }

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("userId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                userService.deleteUser(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
            }
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("Unknown action: " + action));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Integer id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", userService.updateUser(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}
