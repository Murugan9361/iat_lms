package com.iat.lms.repository;

import com.iat.lms.entity.ValidationTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ValidationTestRepository extends JpaRepository<ValidationTest, Long> {
    List<ValidationTest> findByStudentIdAndBatchId(Long studentId, Long batchId);

    List<ValidationTest> findByBatchId(Long batchId);
}
