package com.GLPT.Backend.Controller;

import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Service.ProgressEntryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProgressEntryController {

    private final ProgressEntryService service;

    public ProgressEntryController(ProgressEntryService service){
        this.service = service;
    }

    @PostMapping("/goal/{goalId}/entries")
    public ProgressEntry addEntry(
            @PathVariable long goalId,
                                  @RequestParam String description){
        return service.addEntryToGoal(goalId, description);
    }

    @GetMapping("/entries")
    public List<ProgressEntry> viewAllEntries(){
        return service.getAllEntries();
    }

    @PutMapping("/entries/{entryId}")
    public ProgressEntry renameEntry(
            @PathVariable long entryId,
                                     @RequestParam String newEntryDescription){
        return service.updateDescription(entryId,newEntryDescription);
    }

    @DeleteMapping("/entries/{entryId}")
    public void deleteEntry(@PathVariable long entryId){
        service.deleteDescription(entryId);
    }




}
