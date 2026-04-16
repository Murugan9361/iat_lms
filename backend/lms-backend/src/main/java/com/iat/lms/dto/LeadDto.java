package com.iat.lms.dto;

import com.iat.lms.entity.Lead;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

public class LeadDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String phone;
        private String email;
        private Lead.Source source = Lead.Source.WALK_IN;
        private String courseInterest;
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull
        private Lead.Status status;
        private String notes;
        private LocalDate followUpDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignRequest {
        @NotNull
        private Long salesEmployeeId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String phone;
        private String email;
        private String source;
        private String courseInterest;
        private String status;
        private String assignedTo;
        private String assignedBy;
        private String createdBy;
        private String notes;
        private LocalDate followUpDate;
        private String createdAt;
    }
}
