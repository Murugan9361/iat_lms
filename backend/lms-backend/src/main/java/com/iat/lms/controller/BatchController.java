package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.BatchDto;
import com.iat.lms.service.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','TRAINER_HEAD','SALES_HEAD')")
    public ResponseEntity<ApiResponse<BatchDto.Response>> createBatch(
            @Valid @RequestBody BatchDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                batchService.createBatch(request, userDetails.getUsername()), "Batch created"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BatchDto.Response>>> getAllBatches() {
        return ResponseEntity.ok(ApiResponse.success(batchService.getAllBatches(), "Batches fetched"));
    }

    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BatchDto.Response>>> getActiveBatches() {
        return ResponseEntity.ok(ApiResponse.success(batchService.getActiveBatches(), "Active batches"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BatchDto.Response>> getBatchById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(batchService.getBatchById(id), "Batch fetched"));
    }

    @PostMapping("/{id}/students/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<Void>> assignStudentToBatch(
            @PathVariable Long id, @PathVariable Long studentId) {
        batchService.assignStudentToBatch(id, studentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Student assigned to batch"));
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<Void>> unassignStudentFromBatch(
            @PathVariable Long id, @PathVariable Long studentId) {
        batchService.unassignStudentFromBatch(id, studentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Student removed from batch"));
    }

    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','TRAINER_HEAD','TRAINER')")
    public ResponseEntity<ApiResponse<List<BatchDto.Response>>> getTrainerBatches(@PathVariable Long trainerId) {
        return ResponseEntity.ok(ApiResponse.success(batchService.getTrainerBatches(trainerId), "Trainer batches"));
    }
}
