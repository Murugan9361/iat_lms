package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.StudentDto;
import com.iat.lms.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD')")
    public ResponseEntity<ApiResponse<StudentDto.Response>> enrollStudent(
            @Valid @RequestBody StudentDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                studentService.enrollStudent(request, userDetails.getUsername()), "Student enrolled"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER','TRAINER_HEAD','HR')")
    public ResponseEntity<ApiResponse<List<StudentDto.Response>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(studentService.getAllStudents(), "Students fetched"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER','TRAINER_HEAD','HR') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentDto.Response>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentById(id), "Student fetched"));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<List<StudentDto.Response>>> searchStudents(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(studentService.searchStudents(name), "Search results"));
    }
}
