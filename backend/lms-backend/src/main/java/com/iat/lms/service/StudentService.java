package com.iat.lms.service;

import com.iat.lms.dto.StudentDto;
import com.iat.lms.entity.*;
import com.iat.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Auto-generates Student ID in format IAT0001, IAT0002...
     */
    private synchronized String generateStudentId() {
        Integer maxSeq = studentRepository.findMaxStudentIdSequence();
        int next = (maxSeq == null ? 0 : maxSeq) + 1;
        return String.format("IAT%04d", next);
    }

    @Transactional
    public StudentDto.Response enrollStudent(StudentDto.CreateRequest request, String creatorEmail) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("STUDENT role not found"));
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        // Create user account
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(studentRole)
                .isActive(true)
                .createdBy(creator)
                .build();
        user = userRepository.save(user);

        // Get lead if provided
        Lead lead = null;
        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId()).orElse(null);
            if (lead != null) {
                lead.setStatus(Lead.Status.CONVERTED);
                leadRepository.save(lead);
            }
        }

        // Build student profile
        Student student = Student.builder()
                .studentId(generateStudentId())
                .user(user)
                .lead(lead)
                .dob(request.getDob())
                .gender(request.getGender())
                .aadharNumber(request.getAadharNumber())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .emergencyContactRelation(request.getEmergencyContactRelation())
                .enrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : LocalDate.now())
                .enrollmentTerms(request.getEnrollmentTerms())
                .createdBy(creator)
                .build();

        return toResponse(studentRepository.save(student));
    }

    public List<StudentDto.Response> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public StudentDto.Response getStudentById(Long id) {
        return toResponse(studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id)));
    }

    public StudentDto.Response getStudentByUserId(Long userId) {
        return toResponse(studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for user: " + userId)));
    }

    public List<StudentDto.Response> searchStudents(String name) {
        return studentRepository.searchByName(name).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public StudentDto.Response toResponse(Student s) {
        return StudentDto.Response.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .name(s.getUser().getName())
                .email(s.getUser().getEmail())
                .phone(s.getUser().getPhone())
                .dob(s.getDob())
                .gender(s.getGender() != null ? s.getGender().name() : null)
                .city(s.getCity())
                .state(s.getState())
                .enrollmentDate(s.getEnrollmentDate())
                .photoUrl(s.getPhotoUrl())
                .build();
    }
}
