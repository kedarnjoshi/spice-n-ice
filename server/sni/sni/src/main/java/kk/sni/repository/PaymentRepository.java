package kk.sni.repository;

import kk.sni.model.Payment;
import kk.sni.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByEvent_Id(Long eventId);
    List<Payment> findByStatus(String status);
    List<Payment> findByDueDateBeforeAndStatusNot(LocalDate date, PaymentStatus status);
}
