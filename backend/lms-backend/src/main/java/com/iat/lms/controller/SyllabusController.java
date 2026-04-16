package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.SyllabusDto;
import com.iat.lms.service.SyllabusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/syllabus")
@RequiredArgsConstructor
public class SyllabusController {

    private final SyllabusService syllabusService;

    @PostMapping("/generate/{batchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<List<SyllabusDto.Response>>> generateSyllabus(@PathVariable Long batchId) {
        return ResponseEntity.ok(ApiResponse.success(
                syllabusService.generateSyllabusSlots(batchId), "Syllabus generated"));
    }

    @GetMapping("/batch/{batchId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<SyllabusDto.Response>>> getSyllabusByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(ApiResponse.success(syllabusService.getByBatch(batchId), "Syllabus fetched"));
    }

    @PutMapping("/{id}/topic")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<SyllabusDto.Response>> updateTopic(
            @PathVariable Long id,
            @RequestBody SyllabusDto.CreateTopicRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                syllabusService.updateTopic(id, request, userDetails.getUsername()), "Topic updated"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TRAINER','TRAINER_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SyllabusDto.Response>> updateStatus(
            @PathVariable Long id,
            @RequestBody SyllabusDto.UpdateStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                syllabusService.updateStatus(id, request, userDetails.getUsername()), "Status updated"));
    }
}
