package com.iat.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.iat.lms.repository.UserRepository;
import com.iat.lms.entity.User;

@SpringBootApplication
public class LmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@iat.com").ifPresent(user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(user);
                System.out.println("DEBUG: Password reset for admin@iat.com to 'admin123'");
            });
        };
    }
}
