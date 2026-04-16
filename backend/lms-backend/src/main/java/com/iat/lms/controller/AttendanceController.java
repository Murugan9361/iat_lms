package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.AttendanceDto;
import com.iat.lms.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER','TRAINER_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceDto.Response>>> markAttendance(
            @Valid @RequestBody AttendanceDto.MarkRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.markAttendance(request, userDetails.getUsername()),
                "Attendance marked"));
    }

    @GetMapping("/batch/{batchId}/date/{date}")
    @PreAuthorize("hasAnyRole('TRAINER','TRAINER_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceDto.Response>>> getAttendanceByDate(
            @PathVariable Long batchId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendanceByBatchAndDate(batchId, date), "Attendance fetched"));
    }

    @GetMapping("/batch/{batchId}/summary")
    @PreAuthorize("hasAnyRole('TRAINER','TRAINER_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceDto.SummaryResponse>>> getBatchSummary(
            @PathVariable Long batchId) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getBatchAttendanceSummary(batchId), "Batch attendance summary"));
    }

    @GetMapping("/student/{studentId}/batch/{batchId}")
    @PreAuthorize("hasAnyRole('TRAINER','TRAINER_HEAD','ADMIN','SUPER_ADMIN','STUDENT')")
    public ResponseEntity<ApiResponse<AttendanceDto.SummaryResponse>> getStudentSummary(
            @PathVariable Long studentId, @PathVariable Long batchId) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getStudentAttendanceSummary(studentId, batchId), "Student attendance summary"));
    }
}
