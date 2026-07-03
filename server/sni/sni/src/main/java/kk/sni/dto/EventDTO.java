package kk.sni.dto;

import kk.sni.model.EventStatus;
import lombok.Data;

@Data
public class EventDTO {
    private Long id;
    private String name;
    private String clientName;
    private String clientEmail;
    private String miscText;
    private EventStatus eventStatus;
    private Integer guestCount;
    private String venueName;
    private String venueCity;
}