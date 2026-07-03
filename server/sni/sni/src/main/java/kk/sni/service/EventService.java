package kk.sni.service;

import kk.sni.dto.CreateEventRequest;
import kk.sni.dto.EventDTO;
import kk.sni.model.EventStatus;

import java.util.List;

public interface EventService {
    EventDTO getEventById(Long id);
    List<EventDTO> getAllEvents();
    List<EventDTO> getEventsByStatus(EventStatus status);

    EventDTO createEvent(CreateEventRequest request);
    EventDTO updateEventStatus(Long id, String status);
}
