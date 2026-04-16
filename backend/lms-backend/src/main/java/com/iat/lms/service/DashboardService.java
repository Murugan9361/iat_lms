package com.iat.lms.service;

import com.iat.lms.dto.DashboardDto;
import com.iat.lms.entity.*;
import com.iat.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final LeadRepository leadRepository;
    private final BatchRepository batchRepository;
    private final PaymentRepository paymentRepository;
    private final PlacementRepository placementRepository;
    private final AttendanceRepository attendanceRepository;
    private final ValidationTestRepository validationTestRepository;
    private final MockInterviewRepository mockInterviewRepository;
    private final StudentQueryRepository studentQueryRepository;

    public DashboardDto.AdminDashboard getAdminDashboard() {
        return DashboardDto.AdminDashboard.builder()
                .totalUsers(userRepository.count())
                .totalStudents(studentRepository.count())
                .totalLeads(leadRepository.count())
                .convertedLeads(leadRepository.countConverted())
                .activeBatches(batchRepository.findActiveBatches().size())
                .totalTrainers(userRepository.findByRoleName("TRAINER").size())
                .totalFeesCollected(paymentRepository.sumTotalPaid())
                .totalFeesPending(paymentRepository.sumTotalPending())
                .placedStudents(placementRepository.findByResultStatus(Placement.ResultStatus.PASSED).size())
                .build();
    }

    public DashboardDto.StudentDashboard getStudentDashboard(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // get first active batch
        Long batchId = null;
        var batches = batchRepository.findBatchesByStudentId(studentId);
        if (!batches.isEmpty())
            batchId = batches.get(0).getId();

        long total = batchId != null ? attendanceRepository.countTotal(studentId, batchId) : 0;
        long present = batchId != null ? attendanceRepository.countPresent(studentId, batchId) : 0;
        double pct = total > 0 ? (present * 100.0 / total) : 0;

        Payment payment = paymentRepository.findByStudentId(studentId).orElse(null);
        BigDecimal totalFees = payment != null ? payment.getTotalFees() : BigDecimal.ZERO;
        BigDecimal paidFees = payment != null ? payment.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal pendingFees = totalFees.subtract(paidFees);

        long queries = studentQueryRepository.findByStudentId(studentId).stream()
                .filter(q -> q.getStatus() == StudentQuery.Status.OPEN).count();
        long tests = batchId != null ? validationTestRepository.findByStudentIdAndBatchId(studentId, batchId).size()
                : 0;
        long mocks = batchId != null ? mockInterviewRepository.findByStudentIdAndBatchId(studentId, batchId).size() : 0;

        return DashboardDto.StudentDashboard.builder()
                .studentId(student.getStudentId())
                .name(student.getUser().getName())
                .batchName(batches.isEmpty() ? null : batches.get(0).getBatchName())
                .attendancePercentage(Math.round(pct * 100.0) / 100.0)
                .totalDays(total).presentDays(present)
                .totalFees(totalFees).paidFees(paidFees).pendingFees(pendingFees)
                .pendingQueries(queries)
                .weeklyTestCount(tests)
                .mockInterviewCount(mocks)
                .build();
    }
}
