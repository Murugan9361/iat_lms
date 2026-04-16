package com.iat.lms.service;

import com.iat.lms.dto.LeadDto;
import com.iat.lms.entity.Lead;
import com.iat.lms.entity.User;
import com.iat.lms.repository.LeadRepository;
import com.iat.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    @Transactional
    public LeadDto.Response createLead(LeadDto.CreateRequest request, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lead lead = Lead.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .source(request.getSource())
                .courseInterest(request.getCourseInterest())
                .notes(request.getNotes())
                .status(Lead.Status.NEW)
                .createdBy(creator)
                .build();

        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadDto.Response assignLead(Long leadId, Long salesEmployeeId, String assignerEmail) {
        Lead lead = findLead(leadId);
        User salesEmployee = userRepository.findById(salesEmployeeId)
                .orElseThrow(() -> new RuntimeException("Sales employee not found: " + salesEmployeeId));
        User assigner = userRepository.findByEmail(assignerEmail)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));

        lead.setAssignedTo(salesEmployee);
        lead.setAssignedBy(assigner);
        lead.setStatus(Lead.Status.ASSIGNED);
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadDto.Response updateStatus(Long leadId, LeadDto.UpdateStatusRequest request) {
        Lead lead = findLead(leadId);
        lead.setStatus(request.getStatus());
        if (request.getNotes() != null)
            lead.setNotes(request.getNotes());
        if (request.getFollowUpDate() != null)
            lead.setFollowUpDate(request.getFollowUpDate());
        if (request.getStatus() == Lead.Status.CONVERTED)
            lead.setConvertedAt(LocalDateTime.now());
        return toResponse(leadRepository.save(lead));
    }

    public List<LeadDto.Response> getAllLeads() {
        return leadRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<LeadDto.Response> getLeadsByEmployee(Long userId) {
        return leadRepository.findByAssignedToId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<LeadDto.Response> getLeadsByCreator(Long userId) {
        return leadRepository.findByCreatedById(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<LeadDto.Response> searchLeads(String name) {
        return leadRepository.searchByName(name).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Lead findLead(Long id) {
        return leadRepository.findById(id).orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }

    public LeadDto.Response toResponse(Lead lead) {
        return LeadDto.Response.builder()
                .id(lead.getId())
                .name(lead.getName())
                .phone(lead.getPhone())
                .email(lead.getEmail())
                .source(lead.getSource() != null ? lead.getSource().name() : null)
                .courseInterest(lead.getCourseInterest())
                .status(lead.getStatus() != null ? lead.getStatus().name() : null)
                .assignedTo(lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null)
                .assignedBy(lead.getAssignedBy() != null ? lead.getAssignedBy().getName() : null)
                .createdBy(lead.getCreatedBy() != null ? lead.getCreatedBy().getName() : null)
                .notes(lead.getNotes())
                .followUpDate(lead.getFollowUpDate())
                .createdAt(lead.getCreatedAt() != null ? lead.getCreatedAt().toString() : null)
                .build();
    }
}
