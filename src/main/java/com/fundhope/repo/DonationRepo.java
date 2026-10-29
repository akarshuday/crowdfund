package com.fundhope.repo;
import com.fundhope.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DonationRepo extends JpaRepository<Donation, Long> { List<Donation> findByCampaignIdOrderByPaidAtDesc(Long id); }
