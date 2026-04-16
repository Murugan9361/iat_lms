package com.iat.lms.repository;

import com.iat.lms.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByAssignedToId(Long userId);

    List<Lead> findByCreatedById(Long userId);

    List<Lead> findByStatus(Lead.Status status);

    @Query("SELECT l FROM Lead l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%',:name,'%'))")
    List<Lead> searchByName(@Param("name") String name);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.status = 'CONVERTED'")
    long countConverted();

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.status = 'NEW'")
    long countNew();
}
