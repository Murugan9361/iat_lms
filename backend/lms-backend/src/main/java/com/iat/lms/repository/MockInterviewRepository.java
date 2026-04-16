package com.iat.lms.repository;

import com.iat.lms.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByStudentIdAndBatchId(Long studentId, Long batchId);

    List<MockInterview> findByBatchId(Long batchId);
}
