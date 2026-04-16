package com.iat.lms.repository;

import com.iat.lms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    @Query("SELECT s FROM Student s WHERE LOWER(s.user.name) LIKE LOWER(CONCAT('%',:name,'%'))")
    List<Student> searchByName(@Param("name") String name);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(s.studentId, 4) AS int)), 0) FROM Student s")
    Integer findMaxStudentIdSequence();
}
