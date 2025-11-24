package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.ProgressEntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressEntryService {

    private final ProgressEntryRepository repo;
    private final GoalRepository goalRepo;

    ProgressEntryService(ProgressEntryRepository repo, GoalRepository goalRepo){
        this.repo = repo;
        this.goalRepo = goalRepo;
    }

    /**
     * Create entry description for a Goal
     */
    public ProgressEntry addEntryToGoal(long goalId, String description){

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Entry Id not found"
                ));

        ProgressEntry entry = new ProgressEntry();
        entry.setDescription(description);

        entry.setGoal(goal);

        return repo.save(entry);
    }

    /**
     * -- View all progress description
     *  for a Goal
     */
    public List<ProgressEntry> getAllEntries(){
        return repo.findAll();
    }


    /**
     * -- Renamed the entry Description
     *  if not found throw exception
     */
    public ProgressEntry updateDescription(long entryId, String  newEntryDescription){
            ProgressEntry entry = repo.findById(entryId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,"Entry id not found"
                    ));

            entry.setDescription(newEntryDescription);
            return repo.save(entry);

    }

    /**
     * -- Delete an entry by id
     */
    public void deleteDescription(long entryId){

        if(!repo.existsById(entryId)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,"Entry id not found"
            );
        }
        repo.deleteById(entryId);
    }





}
