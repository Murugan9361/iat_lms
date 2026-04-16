package com.iat.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    public enum ExperienceType {
        FRESHER, EXPERIENCED
    }

    public enum EmploymentType {
        FREELANCER, PERMANENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_type")
    private ExperienceType experienceType = ExperienceType.FRESHER;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    private EmploymentType employmentType = EmploymentType.PERMANENT;

    @Column(name = "aadhar_number", length = 12)
    private String aadharNumber;

    @Column(name = "pan_number", length = 10)
    private String panNumber;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "signature_url", length = 500)
    private String signatureUrl;

    // Experienced docs
    @Column(name = "experience_cert_url", length = 500)
    private String experienceCertUrl;

    @Column(name = "salary_slip_url", length = 500)
    private String salarySlipUrl;

    // Fresher docs
    @Column(name = "college_cert_url", length = 500)
    private String collegeCertUrl;

    @Column(name = "course_cert_url", length = 500)
    private String courseCertUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
