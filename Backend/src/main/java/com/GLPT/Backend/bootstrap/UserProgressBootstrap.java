package com.GLPT.Backend.bootstrap;

import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Repository.UserProgressRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserProgressBootstrap implements CommandLineRunner {

    private final UserProgressRepository repository;


    public UserProgressBootstrap(UserProgressRepository repository){
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception{
        if(repository.count() == 0){
            UserProgress progress = new UserProgress();
            repository.save(progress);
            System.out.println("Initialized default UserProgress");
        }
    }

}
