package com.iat.lms.dto;

import com.iat.lms.entity.Batch;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

public class BatchDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank
        private String batchName;
        @NotNull
        private Long courseId;
        private Long trainerId;
        @NotNull
        private Batch.BatchType batchType;
        private String timing;
        @NotNull
        private LocalDate startDate;
        @NotNull
        private LocalDate endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String batchName;
        private String courseName;
        private String trainerName;
        private String batchType;
        private String timing;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isActive;
        private int studentCount;
    }
}
