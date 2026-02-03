package com.securityagency.controller;

import com.securityagency.model.*;
import com.securityagency.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validation
            if (request.getFirstName() == null || !request.getFirstName().matches("^[a-zA-ZĄ-ż]+$") || request.getFirstName().length() < 3) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "First name must be at least 3 characters and contain only letters", null, 0, false));
            }

            if (request.getLastName() == null || !request.getLastName().matches("^[a-zA-ZĄ-ż]+$") || request.getLastName().length() < 3) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Last name must be at least 3 characters and contain only letters", null, 0, false));
            }

            if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid email format", null, 0, false));
            }

            if (request.getPassword() == null || !request.getPassword().matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Password must be at least 8 characters with uppercase, digit, and special character", null, 0, false));
            }

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Passwords do not match", null, 0, false));
            }

            User user = userService.registerUser(request.getFirstName(), request.getLastName(), request.getEmail(), request.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(true, "Registration successful", user, 0, false));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage(), null, 0, false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            int failedAttempts = userService.getFailedLoginAttempts(request.getEmail());
            boolean isLocked = userService.isAccountLocked(request.getEmail());

            User user = userService.loginUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new AuthResponse(true, "Login successful", user, 0, false));
        } catch (Exception e) {
            int failedAttempts = userService.getFailedLoginAttempts(request.getEmail());
            boolean isLocked = userService.isAccountLocked(request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, e.getMessage(), null, failedAttempts, isLocked));
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid email format", null, 0, false));
            }

            if (request.getNewPassword() == null || !request.getNewPassword().matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Password must be at least 8 characters with uppercase, digit, and special character", null, 0, false));
            }

            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Passwords do not match", null, 0, false));
            }

            User user = userService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok(new AuthResponse(true, "Password reset successful", user, 0, false));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage(), null, 0, false));
        }
    }
}
