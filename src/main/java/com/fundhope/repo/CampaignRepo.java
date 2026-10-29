package com.fundhope.repo;
import com.fundhope.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface CampaignRepo extends JpaRepository<Campaign, Long> {
    List<Campaign> findByOwnerId(Long id);
    @Query("select coalesce(sum(c.raisedAmount),0) from Campaign c")
    double totalRaised();
}
