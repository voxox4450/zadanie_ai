package com.securityagency.model;

public class AuthResponse {
    private boolean success;
    private String message;
    private User user;
    private int failedAttempts;
    private boolean accountLocked;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, User user, int failedAttempts, boolean accountLocked) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.failedAttempts = failedAttempts;
        this.accountLocked = accountLocked;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }

    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }
}
