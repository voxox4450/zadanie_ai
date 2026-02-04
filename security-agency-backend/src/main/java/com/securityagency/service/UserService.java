package com.securityagency.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.securityagency.model.User;

@Service
public class UserService {
    private final Map<String, User> users = new HashMap<>();
    private final Map<String, Integer> failedLoginAttempts = new HashMap<>();
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String firstName, String lastName, String email, String password) throws Exception {
        if (users.containsKey(email)) {
            throw new Exception("User already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(hashPassword(password));
        user.setFailedLoginAttempts(0);
        user.setLocked(false);

        users.put(email, user);
        failedLoginAttempts.put(email, 0);
        return user;
    }

    public User loginUser(String email, String password) throws Exception {
        if (!users.containsKey(email)) {
            throw new Exception("User not found");
        }

        User user = users.get(email);

        if (user.isLocked()) {
            throw new Exception("Account is locked. Please reset your password.");
        }

        if (!verifyPassword(password, user.getPassword())) {
            int attempts = failedLoginAttempts.getOrDefault(email, 0) + 1;
            failedLoginAttempts.put(email, attempts);

            if (attempts >= 3) {
                user.setLocked(true);
                throw new Exception("Account locked after 3 failed attempts. Please reset your password.");
            }

            throw new Exception("Invalid credentials. Attempt " + attempts + " of 3");
        }

        // Successful login
        failedLoginAttempts.put(email, 0);
        user.setFailedLoginAttempts(0);
        return user;
    }

    public User resetPassword(String email, String newPassword) throws Exception {
        if (!users.containsKey(email)) {
            throw new Exception("User not found");
        }

        User user = users.get(email);
        user.setPassword(hashPassword(newPassword));
        user.setLocked(false);
        user.setFailedLoginAttempts(0);
        failedLoginAttempts.put(email, 0);

        return user;
    }

    public int getFailedLoginAttempts(String email) {
        return failedLoginAttempts.getOrDefault(email, 0);
    }

    public boolean isAccountLocked(String email) {
        if (!users.containsKey(email)) {
            return false;
        }
        return users.get(email).isLocked();
    }

    private String hashPassword(String password) {
        // BCrypt hashing with automatic salt generation
        return passwordEncoder.encode(password);
    }

    private boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
