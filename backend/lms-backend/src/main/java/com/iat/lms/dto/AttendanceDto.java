package com.iat.lms.dto;

import com.iat.lms.entity.Attendance;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

public class AttendanceDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MarkRequest {
        @NotNull
        private Long batchId;
        @NotNull
        private Long syllabusId;
        @NotNull
        private LocalDate date;
        @NotNull
        private List<StudentAttendance> students;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class StudentAttendance {
            private Long studentId;
            private Attendance.Status status;
            private String remarks;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long batchId;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private LocalDate date;
        private String status;
        private String markedBy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummaryResponse {
        private Long studentId;
        private String studentName;
        private String studentCode;
        private long totalDays;
        private long presentDays;
        private double attendancePercentage;
    }
}
