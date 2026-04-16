package com.iat.lms.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class UserDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank
        private String name;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(min = 6)
        private String password;
        private String phone;
        @NotNull
        private Long roleId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String name;
        private String phone;
        private Boolean isActive;
        private Long roleId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private Boolean isActive;
        private String createdAt;
    }
}
