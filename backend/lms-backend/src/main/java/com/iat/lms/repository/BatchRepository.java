package com.iat.lms.repository;

import com.iat.lms.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByTrainerId(Long trainerId);

    List<Batch> findByCourseId(Long courseId);

    boolean existsByBatchName(String batchName);

    @Query("SELECT b FROM Batch b WHERE b.isActive = true ORDER BY b.startDate DESC")
    List<Batch> findActiveBatches();

    @Query("SELECT b FROM Batch b JOIN BatchStudent bs ON bs.batch.id = b.id WHERE bs.student.id = :studentId")
    List<Batch> findBatchesByStudentId(@Param("studentId") Long studentId);
}
