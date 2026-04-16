package com.iat.lms.dto;

import com.iat.lms.entity.Syllabus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

public class SyllabusDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTopicRequest {
        @NotNull
        private Long batchId;
        @NotNull
        private LocalDate date;
        @NotBlank
        private String topic;
        private String description;
        private Integer dayNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull
        private Syllabus.Status status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long batchId;
        private String batchName;
        private LocalDate date;
        private String topic;
        private String description;
        private String status;
        private Integer dayNumber;
        private String updatedBy;
    }
}
