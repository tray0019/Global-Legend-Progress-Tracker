
#### View goa id in service

public Goal viewGoal(long goalId) {
return repo.findById(goalId)
.orElseThrow(() ->
new ResponseStatusException(HttpStatus.NOT_FOUND, "Goal not found")
);
}