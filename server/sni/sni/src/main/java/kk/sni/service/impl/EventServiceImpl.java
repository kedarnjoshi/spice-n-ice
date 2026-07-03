package kk.sni.service.impl;

import kk.sni.dto.CreateEventRequest;
import kk.sni.dto.EventDTO;
import kk.sni.model.Event;
import kk.sni.model.EventStatus;
import kk.sni.model.Venue;
import kk.sni.repository.EventRepository;
import kk.sni.repository.VenueRepository;
import kk.sni.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Override
    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));
        return mapToDTO(event);
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<EventDTO> getEventsByStatus(EventStatus status) {
        return eventRepository.findEventByEventStatus(status).stream().map(this::mapToDTO).toList();
    }

    @Override
    public EventDTO createEvent(CreateEventRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        Event event = new Event();
        event.setName(request.getName());
        event.setClientName(request.getClientName());
        event.setClientEmail(request.getClientEmail());
        event.setVenue(venue);
        event.setEventStatus(EventStatus.IN_PROGRESS);
        event.setGuestCount(request.getGuestCount());
        event.setCreatedAt(LocalDateTime.now());

        Event saved = eventRepository.save(event);
        return mapToDTO(saved);
    }

    @Override
    public EventDTO updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));

        event.setEventStatus(EventStatus.valueOf(status));
        Event saved = eventRepository.save(event);
        return mapToDTO(saved);
    }

    private EventDTO mapToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setClientName(event.getClientName());
        dto.setClientEmail(event.getClientEmail());
        dto.setEventStatus(event.getEventStatus());
        dto.setGuestCount(event.getGuestCount());
        dto.setVenueName(event.getVenue().getName());
        dto.setVenueCity(event.getVenue().getCity());
        return dto;
    }
}