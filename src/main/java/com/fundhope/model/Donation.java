package com.fundhope.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class Donation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne private Campaign campaign;
    private String donorName;
    private double amount;
    private String paymentRef;
    private LocalDateTime paidAt = LocalDateTime.now();
    public Long getId() { return id; } public Campaign getCampaign() { return campaign; } public void setCampaign(Campaign c) { campaign = c; }
    public String getDonorName() { return donorName; } public void setDonorName(String d) { donorName = d; }
    public double getAmount() { return amount; } public void setAmount(double a) { amount = a; }
    public String getPaymentRef() { return paymentRef; } public void setPaymentRef(String p) { paymentRef = p; }
    public LocalDateTime getPaidAt() { return paidAt; }
}
