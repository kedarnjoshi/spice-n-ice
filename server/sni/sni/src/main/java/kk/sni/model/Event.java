package kk.sni.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="venue_id")
    private Venue venue;

    private String name;

    @Column(nullable=false)
    private String clientName;

    @Column(nullable=false)
    private String clientEmail;

    private String miscText;
}
