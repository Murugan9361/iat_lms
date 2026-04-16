package com.iat.lms.service;

import com.iat.lms.dto.AttendanceDto;
import com.iat.lms.entity.*;
import com.iat.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final SyllabusRepository syllabusRepository;
    private final StudentRepository studentRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final UserRepository userRepository;

    /**
     * CRITICAL RULE: Block attendance if topic is NOT completed.
     */
    @Transactional
    public List<AttendanceDto.Response> markAttendance(AttendanceDto.MarkRequest request, String trainerEmail) {
        Syllabus syllabus = syllabusRepository.findById(request.getSyllabusId())
                .orElseThrow(() -> new RuntimeException("Syllabus entry not found"));

        // Enforce: topic must be COMPLETED before marking attendance
        if (syllabus.getStatus() != Syllabus.Status.COMPLETED) {
            throw new RuntimeException("ATTENDANCE BLOCKED: Topic '" + syllabus.getTopic()
                    + "' is not yet completed. Mark topic as COMPLETED first.");
        }

        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        List<AttendanceDto.Response> results = new ArrayList<>();
        for (AttendanceDto.MarkRequest.StudentAttendance sa : request.getStudents()) {
            Student student = studentRepository.findById(sa.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + sa.getStudentId()));

            // Upsert attendance
            Attendance attendance = attendanceRepository
                    .findByBatchIdAndStudentIdAndDate(request.getBatchId(), sa.getStudentId(), request.getDate())
                    .orElse(Attendance.builder()
                            .batch(Batch.builder().id(request.getBatchId()).build())
                            .student(student)
                            .syllabus(syllabus)
                            .date(request.getDate())
                            .build());

            attendance.setStatus(sa.getStatus());
            attendance.setRemarks(sa.getRemarks());
            attendance.setMarkedBy(trainer);
            results.add(toResponse(attendanceRepository.save(attendance)));
        }
        return results;
    }

    public List<AttendanceDto.Response> getAttendanceByBatchAndDate(Long batchId, java.time.LocalDate date) {
        return attendanceRepository.findByBatchIdAndDate(batchId, date)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AttendanceDto.SummaryResponse getStudentAttendanceSummary(Long studentId, Long batchId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        long total = attendanceRepository.countTotal(studentId, batchId);
        long present = attendanceRepository.countPresent(studentId, batchId);
        double pct = total > 0 ? (present * 100.0 / total) : 0;

        return AttendanceDto.SummaryResponse.builder()
                .studentId(studentId)
                .studentName(student.getUser().getName())
                .studentCode(student.getStudentId())
                .totalDays(total)
                .presentDays(present)
                .attendancePercentage(Math.round(pct * 100.0) / 100.0)
                .build();
    }

    public List<AttendanceDto.SummaryResponse> getBatchAttendanceSummary(Long batchId) {
        return batchStudentRepository.findByBatchId(batchId).stream()
                .map(bs -> getStudentAttendanceSummary(bs.getStudent().getId(), batchId))
                .collect(Collectors.toList());
    }

    private AttendanceDto.Response toResponse(Attendance a) {
        return AttendanceDto.Response.builder()
                .id(a.getId())
                .batchId(a.getBatch().getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getUser().getName())
                .studentCode(a.getStudent().getStudentId())
                .date(a.getDate())
                .status(a.getStatus() != null ? a.getStatus().name() : null)
                .markedBy(a.getMarkedBy() != null ? a.getMarkedBy().getName() : null)
                .build();
    }
}
