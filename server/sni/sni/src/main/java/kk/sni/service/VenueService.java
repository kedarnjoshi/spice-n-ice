package kk.sni.service;

import kk.sni.dto.AddVenueRequest;
import kk.sni.model.Venue;

import java.util.List;

public interface VenueService {
    List<Venue> getVenues();
    Venue addVenue(AddVenueRequest request);
}
