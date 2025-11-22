# Goal Test Cases

### TC-G1 - Create Goal

Test Case ID: TC-G1

Title: Create a new goal (valid request)

Endpoint: POST /goals

1. Pre-conditions
    - Database is running and empty or has any number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
HTTP Method: POST
URL: http://localhost:8080/goals

Body:
{
    "goalTitle": " "
}

3. Expected Result
    Expected Status Code:

    Expected Response Body:
    {
        "id":
        "goalTitle":
    }