package kk.sni.controller;

import jakarta.validation.Valid;
import kk.sni.dto.AddVenueRequest;
import kk.sni.model.Venue;
import kk.sni.service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue")
public class VenueController {
    VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping("/list")
    public List<Venue> getVenues(){
        return venueService.getVenues();
    }

    @PostMapping("/new")
    public ResponseEntity<Venue> addVenue(@Valid @RequestBody AddVenueRequest addVenueRequest){
        Venue added = venueService.addVenue(addVenueRequest);
        return ResponseEntity.ok(added);
    }
}
