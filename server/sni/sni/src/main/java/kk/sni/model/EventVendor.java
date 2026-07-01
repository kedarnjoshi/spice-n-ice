package kk.sni.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class EventVendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "event_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private Event event;

    @JoinColumn(name="vendor_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private Vendor vendor;

    @Column(nullable = false)
    private Long priceInPaise;

    @Column(nullable = false)
    private Integer quantity;

}
