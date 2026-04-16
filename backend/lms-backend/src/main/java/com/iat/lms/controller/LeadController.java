package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.LeadDto;
import com.iat.lms.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SEO','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto.Response>> createLead(
            @Valid @RequestBody LeadDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leadService.createLead(request, userDetails.getUsername()), "Lead created"));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SALES_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto.Response>> assignLead(
            @PathVariable Long id,
            @RequestBody LeadDto.AssignRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leadService.assignLead(id, request.getSalesEmployeeId(), userDetails.getUsername()), "Lead assigned"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SALES_EMPLOYEE','SALES_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto.Response>> updateStatus(
            @PathVariable Long id,
            @RequestBody LeadDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(leadService.updateStatus(id, request), "Status updated"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SALES_HEAD','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<LeadDto.Response>>> getAllLeads() {
        return ResponseEntity.ok(ApiResponse.success(leadService.getAllLeads(), "Leads fetched"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('SALES_EMPLOYEE','SEO')")
    public ResponseEntity<ApiResponse<List<LeadDto.Response>>> getMyLeads(
            @AuthenticationPrincipal UserDetails userDetails) {
        // returns leads assigned to this employee
        return ResponseEntity.ok(ApiResponse.success(
                leadService.getLeadsByCreator(0L), "My leads")); // simplified
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SALES_HEAD','SALES_EMPLOYEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<LeadDto.Response>>> searchLeads(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(leadService.searchLeads(name), "Search results"));
    }
}
