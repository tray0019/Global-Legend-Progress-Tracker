package com.GLPT.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndApplication.class, args);

		System.out.println("CLIENT ID = " + System.getenv("GOOGLE_CLIENT_ID"));
		System.out.println("SECRET = " + (System.getenv("GOOGLE_CLIENT_SECRET") != null));

	}


}
