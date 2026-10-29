package com.fundhope.model;
import jakarta.persistence.*;
@Entity @Table(name = "users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    @Column(unique = true) private String email;
    private String passwordHash;
    public Long getId() { return id; } public String getName() { return name; } public void setName(String n) { name = n; }
    public String getEmail() { return email; } public void setEmail(String e) { email = e; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String p) { passwordHash = p; }
}
