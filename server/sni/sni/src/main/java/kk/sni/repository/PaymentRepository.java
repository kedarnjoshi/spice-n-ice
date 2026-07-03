package kk.sni.repository;

import kk.sni.model.Payment;
import kk.sni.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByEvent_Id(Long eventId);
    List<Payment> findByPaymentStatus(PaymentStatus status);
    List<Payment> findByDueDateBeforeAndPaymentStatusNot(LocalDate date, PaymentStatus status);
}
