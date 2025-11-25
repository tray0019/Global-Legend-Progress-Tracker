package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.EntryCreateDto;
import com.GLPT.Backend.DTO.EntryResponseDto;
import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Service.ProgressEntryService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class ProgressEntryController {

    private final ProgressEntryService service;

    public ProgressEntryController(ProgressEntryService service){
        this.service = service;
    }

    /**
     * -- Add and Return goal id and entry description
     */
    @PostMapping("/goal/{goalId}/entries")
    public EntryResponseDto addEntry(@PathVariable long goalId,
                                     @RequestBody EntryCreateDto dto) {
        ProgressEntry saved = service.addEntryToGoal(goalId,dto.getDescription());
        return new EntryResponseDto(saved.getId(), saved.getDescription());
    }

    /**
     *  -- View all entries with ENtryResponseDto
     */
    @GetMapping("/entries")
    public List<EntryResponseDto> viewAllEntries(){
        List<ProgressEntry> entries = service.getAllEntries();
        List<EntryResponseDto> entryList = new ArrayList<>();

        for(ProgressEntry entry: entries){
            EntryResponseDto dto = new EntryResponseDto(entry.getId(),entry.getDescription());
            entryList.add(dto);
        }

        return entryList;
    }

    /**
     * -- Take the id of entry and update the description
     */
    @PutMapping("/entries/{entryId}")
    public EntryResponseDto renameEntry(@PathVariable long entryId,
                                        @RequestBody EntryCreateDto dto){

        ProgressEntry saved = service.updateDescription(entryId,dto.getDescription());

        return new EntryResponseDto(saved.getId(), saved.getDescription());
    }

    @DeleteMapping("/entries/{entryId}")
    public void deleteEntry(@PathVariable long entryId){
        service.deleteDescription(entryId);
    }




}
