package com.fundhope.web;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/** Adds the logged-in person's name to EVERY page, so the menu always shows "Hi, Name". */
@ControllerAdvice
public class GlobalModel {
    @ModelAttribute("me")
    public String me(HttpSession s) { return (String) s.getAttribute("userName"); }
}
