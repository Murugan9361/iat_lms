package com.iat.lms.dto;

import com.iat.lms.entity.Student;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

public class StudentDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull
        private Long leadId;
        // User details
        @NotBlank
        private String name;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(min = 6)
        private String password;
        private String phone;
        // Personal
        private LocalDate dob;
        private Student.Gender gender;
        private String aadharNumber;
        // Address
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        // Emergency
        private String emergencyContactName;
        private String emergencyContactPhone;
        private String emergencyContactRelation;
        // Enrollment
        private LocalDate enrollmentDate;
        private String enrollmentTerms;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String studentId;
        private String name;
        private String email;
        private String phone;
        private LocalDate dob;
        private String gender;
        private String city;
        private String state;
        private LocalDate enrollmentDate;
        private String photoUrl;
    }
}
