package kk.sni.service.impl;

import kk.sni.dto.AddVenueRequest;
import kk.sni.model.Venue;
import kk.sni.repository.VenueRepository;
import kk.sni.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;


    @Override
    public List<Venue> getVenues() {
        return venueRepository.findAll();
    }

    @Override
    public Venue addVenue(AddVenueRequest request) {
        Venue venue = new Venue();
        venue.setName(request.name());
        venue.setCity(request.city());
        return venueRepository.save(venue);
    }
}
