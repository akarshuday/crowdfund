package com.fundhope.repo;
import com.fundhope.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepo extends JpaRepository<AppUser, Long> { AppUser findByEmail(String email); }
