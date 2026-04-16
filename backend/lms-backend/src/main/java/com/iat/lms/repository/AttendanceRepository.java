package com.iat.lms.repository;

import com.iat.lms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByBatchIdAndDate(Long batchId, LocalDate date);

    List<Attendance> findByStudentIdAndBatchId(Long studentId, Long batchId);

    Optional<Attendance> findByBatchIdAndStudentIdAndDate(Long batchId, Long studentId, LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.batch.id = :batchId AND a.status = 'PRESENT'")
    long countPresent(@Param("studentId") Long studentId, @Param("batchId") Long batchId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.batch.id = :batchId")
    long countTotal(@Param("studentId") Long studentId, @Param("batchId") Long batchId);
}
