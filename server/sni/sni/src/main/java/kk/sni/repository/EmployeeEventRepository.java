package kk.sni.repository;

import kk.sni.model.EmployeeEvent;
import kk.sni.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeEventRepository extends JpaRepository<EmployeeEvent, Long> {
    List<EmployeeEvent> findByEvent_Id(Long eventId);
    List<EmployeeEvent> findByEmployee_Id(Long employeeId);
    List<EmployeeEvent> findByEventAndAttendedFalse(Event event);
}
