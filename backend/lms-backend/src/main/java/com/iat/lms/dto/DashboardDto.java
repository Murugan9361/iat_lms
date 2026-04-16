package com.iat.lms.dto;

import lombok.*;
import java.math.BigDecimal;

public class DashboardDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboard {
        private long totalUsers;
        private long totalStudents;
        private long totalLeads;
        private long convertedLeads;
        private long activeBatches;
        private long totalTrainers;
        private BigDecimal totalFeesCollected;
        private BigDecimal totalFeesPending;
        private long placedStudents;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentDashboard {
        private String studentId;
        private String name;
        private String batchName;
        private double attendancePercentage;
        private long totalDays;
        private long presentDays;
        private BigDecimal totalFees;
        private BigDecimal paidFees;
        private BigDecimal pendingFees;
        private long pendingQueries;
        private long weeklyTestCount;
        private long mockInterviewCount;
    }
}
