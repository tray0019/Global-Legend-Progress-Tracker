# Global Legend Progress Tracker

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-2.7.5-brightgreen)
![GitHub](https://img.shields.io/badge/Version_Control-GitHub-black)
![IntelliJ IDEA](https://img.shields.io/badge/IDE-IntelliJ_IDEA-purple)
![Lombok](https://img.shields.io/badge/Lombok-Enabled-yellow)

## Description
This is a progress tracking application where user track their progress to reach their goal. User gain rank for continuos streak just like the game mobile legend. 

## Technologies and Tools Backend
- Spring Boot
- Spring Web
- LomBok
- IntelliJ IDEA
- Maven

## Frontend
- React
- Visual Studio Code
- JavaScript
- Axios

## Steps Taken
1. Focus on BackEnd development
2. Created spring boot project. Added SpringBoot dependency
3. Added Goal Entity and Progress Entity.
  - Goal Entity: Id, Title ,and List of entries
  - Progress Entity: Id, description and Goal
4. Goal Entity and Progress has dependency and mapped for databaes relationship
  - @Entity
  - @ManyToOne | @OneToMany 
5. Added Goal and Progress entry repository
6. Created CRUD for GoalService Class
  - A method getGoal get goal title and it's entries
7. Created CRUD for Progress Entry Class
8. Setup GoalRestController that uses GoalService methods
9. Setup ProgressController that uses ProgressSerEntryService methods
10. Created DTO for creating Goal and its process
    - GoalCreateDto | GoalProcessDto
11. Modified method in GoalController to use dto attributes
12. Created DTO for creating Response Entry and its process
13. Modified medthod in ProgressEntryController to use dto attributes
14. Updated application.properties to connect to Database
15. Test in Postman with QA documents
16. Updated code added validation dependcy to return @NotBlank for goalTitle with the use of ResponseStatusException
17. Retest everything in postman and succesfully pass! ✅✅✅👌

18. Focus on Backend. Coded UI and Progress functionalities in one file app.js to test all crud functions.
19. Added Cross Origin for Goal and Progress Entry controller.
20. Updated Goal Entity to cascade entries lists.
21. Used Axios and JavaScript, coded all UI and functionalities
      - List of Goals
      - Add entry to Goal
      - Deleting a Goal
      - Deleting Entry
      - Adding a Goal
      - Renaming Entry 
      - Renaming Goal
22. Miminum Viable Product created GLTP Version 1!✅✅✅
