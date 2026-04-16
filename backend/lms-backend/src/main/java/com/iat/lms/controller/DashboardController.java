package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.DashboardDto;
import com.iat.lms.service.DashboardService;
import com.iat.lms.service.StudentService;
import com.iat.lms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;
    private final StudentService studentService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardDto.AdminDashboard>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard(), "Dashboard data"));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<DashboardDto.StudentDashboard>> getStudentDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        var user = userService.findByEmail(userDetails.getUsername());
        var student = studentService.getStudentByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getStudentDashboard(student.getId()), "Student dashboard"));
    }
}
