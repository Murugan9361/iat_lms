package com.iat.lms.repository;

import com.iat.lms.entity.Placement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlacementRepository extends JpaRepository<Placement, Long> {
    Optional<Placement> findByStudentId(Long studentId);

    List<Placement> findByResultStatus(Placement.ResultStatus status);
}
