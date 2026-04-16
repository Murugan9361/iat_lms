package com.iat.lms;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.nio.file.*;

public class HashGen {
    public static void main(String[] args) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String h = encoder.encode("admin123");
        Files.writeString(Paths.get("c:\\Lms\\hash.txt"), h);
    }
}
