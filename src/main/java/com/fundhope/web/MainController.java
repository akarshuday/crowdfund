package com.fundhope.web;
import com.fundhope.model.*;
import com.fundhope.repo.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.time.LocalDate;

@Controller
public class MainController {
    private final UserRepo users; private final CampaignRepo campaigns; private final DonationRepo donations; private final PaymentService pay;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
    public MainController(UserRepo u, CampaignRepo c, DonationRepo d, PaymentService p) { users = u; campaigns = c; donations = d; pay = p; }

    private String safeNext(String n) { return (n != null && n.startsWith("/") && !n.startsWith("//")) ? n : "/"; }

    @GetMapping("/") public String home(Model m) {
        m.addAttribute("campaigns", campaigns.findAll(Sort.by(Sort.Direction.DESC, "id")));
        m.addAttribute("campaignCount", campaigns.count());
        m.addAttribute("totalRaised", campaigns.totalRaised());
        m.addAttribute("donorCount", donations.count());
        return "index";
    }

    @GetMapping("/register") public String regForm(@RequestParam(required = false) String next, Model m) { m.addAttribute("next", next); return "register"; }
    @PostMapping("/register") public String reg(@RequestParam String name, @RequestParam String email, @RequestParam String password,
            @RequestParam(required = false) String next, Model m, HttpSession s) {
        if (users.findByEmail(email) != null) { m.addAttribute("next", next); m.addAttribute("error", "That email is already registered. Log in instead."); return "register"; }
        AppUser u = new AppUser(); u.setName(name); u.setEmail(email); u.setPasswordHash(enc.encode(password)); users.save(u);
        s.setAttribute("userId", u.getId()); s.setAttribute("userName", u.getName()); return "redirect:" + safeNext(next); }

    @GetMapping("/login") public String loginForm(@RequestParam(required = false) String next, Model m) { m.addAttribute("next", next); return "login"; }
    @PostMapping("/login") public String login(@RequestParam String email, @RequestParam String password,
            @RequestParam(required = false) String next, Model m, HttpSession s) {
        AppUser u = users.findByEmail(email);
        if (u == null || !enc.matches(password, u.getPasswordHash())) { m.addAttribute("next", next); m.addAttribute("error", "Email or password is wrong. Check both and try again."); return "login"; }
        s.setAttribute("userId", u.getId()); s.setAttribute("userName", u.getName()); return "redirect:" + safeNext(next); }
    @GetMapping("/logout") public String logout(HttpSession s) { s.invalidate(); return "redirect:/"; }

    @GetMapping("/my-campaigns") public String mine(HttpSession s, Model m) {
        Long uid = (Long) s.getAttribute("userId"); if (uid == null) return "redirect:/login?next=/my-campaigns";
        m.addAttribute("list", campaigns.findByOwnerId(uid)); return "mycampaigns"; }

    private String info(Model m, String title, String text) { m.addAttribute("title", title); m.addAttribute("text", text); return "info"; }
    private static final String PLACEHOLDER = "This page is a placeholder. Replace this text with your real policy before launching and before payment-gateway approval.";
    @GetMapping("/about") public String about(Model m) { return info(m, "About FundHope", "FundHope helps people raise money for personal needs, community causes and new ideas, and lets them track every contribution."); }
    @GetMapping("/privacy") public String privacy(Model m) { return info(m, "Privacy Policy", PLACEHOLDER); }
    @GetMapping("/terms") public String terms(Model m) { return info(m, "Terms of Use", PLACEHOLDER); }
    @GetMapping("/refunds") public String refunds(Model m) { return info(m, "Refund Policy", PLACEHOLDER); }

    @GetMapping("/campaigns/new") public String newForm(HttpSession s) { return s.getAttribute("userId") == null ? "redirect:/login?next=/campaigns/new" : "create"; }
    @PostMapping("/campaigns") public String create(@RequestParam String title, @RequestParam String description, @RequestParam String category,
            @RequestParam double goal, @RequestParam String deadline, HttpSession s) {
        Long uid = (Long) s.getAttribute("userId"); if (uid == null) return "redirect:/login?next=/campaigns/new";
        if (goal <= 0 || title.isBlank()) return "redirect:/campaigns/new";
        Campaign c = new Campaign(); c.setTitle(title); c.setDescription(description); c.setCategory(category);
        c.setGoalAmount(goal); c.setDeadline(LocalDate.parse(deadline)); c.setOwner(users.getReferenceById(uid));
        campaigns.save(c); return "redirect:/campaigns/" + c.getId(); }

    @GetMapping("/campaigns/{id}") public String view(@PathVariable Long id, Model m) {
        m.addAttribute("c", campaigns.findById(id).orElseThrow()); m.addAttribute("list", donations.findByCampaignIdOrderByPaidAtDesc(id));
        m.addAttribute("demo", pay.isDemo()); return "campaign"; }

    @PostMapping("/campaigns/{id}/donate") @Transactional
    public String donate(@PathVariable Long id, @RequestParam String donorName, @RequestParam double amount, RedirectAttributes ra) {
        if (amount < 1) return "redirect:/campaigns/" + id;
        String ref = pay.charge(amount);                       // payment first, saving second
        Campaign c = campaigns.findById(id).orElseThrow();
        Donation d = new Donation(); d.setCampaign(c); d.setDonorName(donorName.isBlank() ? "Anonymous" : donorName); d.setAmount(amount); d.setPaymentRef(ref);
        donations.save(d); c.setRaisedAmount(c.getRaisedAmount() + amount);
        ra.addFlashAttribute("thanks", "Thank you, " + d.getDonorName() + "! Your gift of Rs. " + (long) amount + " was received" + (pay.isDemo() ? " (demo payment, no real money)." : "."));
        return "redirect:/campaigns/" + id; }
}
