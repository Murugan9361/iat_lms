package com.iat.lms.repository;

import com.iat.lms.entity.BatchStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BatchStudentRepository extends JpaRepository<BatchStudent, Long> {
    List<BatchStudent> findByBatchId(Long batchId);

    List<BatchStudent> findByStudentId(Long studentId);

    Optional<BatchStudent> findByBatchIdAndStudentId(Long batchId, Long studentId);

    boolean existsByBatchIdAndStudentId(Long batchId, Long studentId);
}
