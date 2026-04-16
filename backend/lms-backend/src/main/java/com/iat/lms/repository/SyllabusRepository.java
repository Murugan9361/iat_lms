package com.iat.lms.repository;

import com.iat.lms.entity.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SyllabusRepository extends JpaRepository<Syllabus, Long> {
    List<Syllabus> findByBatchIdOrderByDateAsc(Long batchId);

    Optional<Syllabus> findByBatchIdAndDate(Long batchId, LocalDate date);

    @Query("SELECT s FROM Syllabus s WHERE s.batch.id = :batchId AND s.date <= :date ORDER BY s.date DESC")
    List<Syllabus> findLatestByBatchAndDate(@Param("batchId") Long batchId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Syllabus s WHERE s.batch.id = :batchId AND s.date = :date")
    Optional<Syllabus> findByBatchAndDate(@Param("batchId") Long batchId, @Param("date") LocalDate date);

    boolean existsByBatchIdAndDate(Long batchId, LocalDate date);
}
