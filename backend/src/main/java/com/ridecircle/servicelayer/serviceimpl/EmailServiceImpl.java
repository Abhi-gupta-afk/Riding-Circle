package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.entity.User;
import com.ridecircle.servicelayer.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender mailSender;

	@Value("${app.mail.from:no-reply@ridecircle.local}")
	private String fromAddress;

	@Value("${app.mail.enabled:false}")
	private boolean mailEnabled;

	@Value("${spring.mail.host:}")
	private String mailHost;

	public EmailServiceImpl(ObjectProvider<JavaMailSender> mailSender) {
		this.mailSender = mailSender.getIfAvailable();
	}

	@Override
	@Async
	public void sendRegistrationEmail(User user) {
		String subject = "Welcome to RideCircle!";
		String text = "Hi " + user.getUsername() + ",\n\n" +
				"Your account has been registered successfully with RideCircle.\n" +
				"You can now log in and start exploring clubs and trips.\n\n" +
				"Happy riding!\nRideCircle Team";

	if (!mailEnabled || mailSender == null || mailHost == null || mailHost.isBlank() || user.getEmail() == null || user.getEmail().isBlank()) {
			System.out.println("[MAIL:DEV] To: " + user.getEmail());
			System.out.println("[MAIL:DEV] Subject: " + subject);
			System.out.println("[MAIL:DEV] Body:\n" + text);
			return;
		}

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(fromAddress);
		message.setTo(user.getEmail());
		message.setSubject(subject);
		message.setText(text);
		mailSender.send(message);
	}
}

