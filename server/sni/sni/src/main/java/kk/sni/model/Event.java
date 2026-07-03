package kk.sni.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="venue_id", nullable=false)
    private Venue venue;

    @Column(nullable = false)
    private String name;

    @Column(nullable=false)
    private String clientName;

    @Column(nullable=false)
    private String clientEmail;

    private String miscText;

    private Integer guestCount;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private EventStatus eventStatus;
}
