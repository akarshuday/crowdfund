package com.fundhope.web;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.UUID;
/** The ONLY place that talks to a payment gateway. Swap the inside of charge() for Razorpay later. */
@Service
public class PaymentService {
    @Value("${payment.razorpay.key:}") private String key;
    public boolean isDemo() { return key == null || key.isBlank(); }
    /** Returns a payment reference if the payment succeeded. */
    public String charge(double amount) {
        if (isDemo()) return "DEMO-" + UUID.randomUUID();   // no real money moves
        throw new UnsupportedOperationException("Add Razorpay order + signature check here (see guide, Step 9)");
    }
}
