package com.iat.lms.repository;

import com.iat.lms.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByStudentId(Long studentId);

    List<Payment> findByStudentIdIn(List<Long> studentIds);

    @Query("SELECT COALESCE(SUM(p.paidAmount),0) FROM Payment p")
    BigDecimal sumTotalPaid();

    @Query("SELECT COALESCE(SUM(p.totalFees - p.paidAmount),0) FROM Payment p")
    BigDecimal sumTotalPending();
}
