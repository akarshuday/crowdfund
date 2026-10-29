package com.fundhope.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
public class Campaign {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    @Column(length = 4000) private String description;
    private String category;
    private double goalAmount;
    private double raisedAmount;
    private LocalDate deadline;
    @ManyToOne private AppUser owner;
    public Long getId() { return id; } public String getTitle() { return title; } public void setTitle(String t) { title = t; }
    public String getDescription() { return description; } public void setDescription(String d) { description = d; }
    public String getCategory() { return category; } public void setCategory(String c) { category = c; }
    public double getGoalAmount() { return goalAmount; } public void setGoalAmount(double g) { goalAmount = g; }
    public double getRaisedAmount() { return raisedAmount; } public void setRaisedAmount(double r) { raisedAmount = r; }
    public LocalDate getDeadline() { return deadline; } public void setDeadline(LocalDate d) { deadline = d; }
    public AppUser getOwner() { return owner; } public void setOwner(AppUser o) { owner = o; }
    public int getPercent() { return goalAmount <= 0 ? 0 : (int) Math.min(100, raisedAmount * 100 / goalAmount); }
}
