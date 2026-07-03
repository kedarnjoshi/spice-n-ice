package kk.sni.controller;

import kk.sni.dto.CreateEventRequest;
import kk.sni.dto.EventDTO;
import kk.sni.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventController {
    EventService eventService;
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/list")
    public List<EventDTO> getAll() {
        return eventService.getAllEvents();
    }

    @PostMapping("/new")
    public ResponseEntity<EventDTO> newEvent(@RequestBody @Valid CreateEventRequest createRequest) {
        EventDTO savedEvent = eventService.createEvent(createRequest);
        return ResponseEntity.ok(savedEvent);
    }
}
