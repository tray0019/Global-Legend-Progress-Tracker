package com.GLPT.Backend.Service;

import com.GLPT.Backend.Repository.ProgressEntryRepository;
import org.springframework.stereotype.Service;

@Service
public class ProgressEntryService {

    private final ProgressEntryRepository repo;

    ProgressEntryService(ProgressEntryRepository repo){
        this.repo = repo;
    }

    //



}
