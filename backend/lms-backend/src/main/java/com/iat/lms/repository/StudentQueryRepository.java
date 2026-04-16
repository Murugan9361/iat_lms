package com.iat.lms.repository;

import com.iat.lms.entity.StudentQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentQueryRepository extends JpaRepository<StudentQuery, Long> {
    List<StudentQuery> findByStudentId(Long studentId);

    List<StudentQuery> findByBatchId(Long batchId);

    List<StudentQuery> findByBatchIdAndStatus(Long batchId, StudentQuery.Status status);
}
