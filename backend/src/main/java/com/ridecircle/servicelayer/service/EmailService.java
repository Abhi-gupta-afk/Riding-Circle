package com.ridecircle.servicelayer.service;

import com.ridecircle.entity.User;

public interface EmailService {
	void sendRegistrationEmail(User user);
}

