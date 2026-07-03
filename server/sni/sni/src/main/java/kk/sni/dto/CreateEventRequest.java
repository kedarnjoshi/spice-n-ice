package kk.sni.dto;

import lombok.Data;

@Data
public class CreateEventRequest {
    private String name;
    private String clientName;
    private String clientEmail;
    private Long venueId;
    private Integer guestCount;
}