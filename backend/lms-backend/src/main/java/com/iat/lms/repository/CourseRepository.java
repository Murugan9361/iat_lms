package com.iat.lms.repository;

import com.iat.lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByIsActiveTrue();
}
