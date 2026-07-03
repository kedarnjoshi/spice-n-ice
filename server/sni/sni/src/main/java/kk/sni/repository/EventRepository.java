package kk.sni.repository;

import kk.sni.model.Event;
import kk.sni.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findEventByEventStatus(EventStatus status);
}
