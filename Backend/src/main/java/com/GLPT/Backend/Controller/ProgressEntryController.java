package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.EntryCreateDto;
import com.GLPT.Backend.DTO.EntryResponseDto;
import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Service.ProgressEntryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class ProgressEntryController {

    private final ProgressEntryService service;

    public ProgressEntryController(ProgressEntryService service){
        this.service = service;
    }

    private User requireUser(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Login required");
        }

        if (!user.isProfileCompleted()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Complete profile first");
        }

        return user;
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

    // ==== USER-SCOPE (Phase 2+) ====
    @PostMapping("/users/goals/{goalId}/entries")
    public EntryResponseDto addEntryForUser(
            @PathVariable long goalId,
            @RequestBody EntryCreateDto dto,
            HttpSession session
    ) {
        User user = requireUser(session);

        ProgressEntry saved = service.addEntryToGoalForUser(
                goalId,
                dto.getDescription(),
                user
        );

        return new EntryResponseDto(
                saved.getId(),
                saved.getDescription()
        );
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

    // ==== USER-SCOPE (Phase 2+) ====

    /**
     * -- Take the id of entry and update the description
     */
    @PutMapping("/entries/{entryId}")
    public EntryResponseDto renameEntry(@PathVariable long entryId,
                                        @RequestBody EntryCreateDto dto){

        ProgressEntry saved = service.updateDescription(entryId,dto.getDescription());

        return new EntryResponseDto(saved.getId(), saved.getDescription());
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PutMapping("/users/entries/{entryId}")
    public EntryResponseDto renameEntryForUser(
            @PathVariable long entryId,
            @RequestBody EntryCreateDto dto,
            HttpSession session
    ) {
        User user = requireUser(session);

        ProgressEntry saved = service.updateDescriptionForUser(
                entryId,
                dto.getDescription(),
                user
        );

        return new EntryResponseDto(
                saved.getId(),
                saved.getDescription()
        );
    }


    @DeleteMapping("/entries/{entryId}")
    public void deleteEntry(@PathVariable long entryId){
        service.deleteDescription(entryId);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @DeleteMapping("/users/entries/{entryId}")
    public void deleteEntryForUser(
            @PathVariable long entryId,
            HttpSession session
    ) {
        User user = requireUser(session);
        service.deleteDescriptionForUser(entryId, user);
    }




}
