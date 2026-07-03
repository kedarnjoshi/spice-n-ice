package kk.sni.repository;

import kk.sni.model.EventVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventVendorRepository extends JpaRepository<EventVendor,Long> {
}
