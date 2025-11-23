# Goal Test Cases

### TC-G1 - Create Goal ✅

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
    "goalTitle": "JavaScript Mastery"
}

3. Expected Result
    Expected Status Code: 200 OK

    Expected Response Body:
    {
       "id": 6,
       "goalTitle": "JavaScript Mastery"
    }

4. Actual Result ✅
    200 OK
   {
       "id": 6,
       "goalTitle": "JavaScript Mastery"
    }
    - DataBase updated successfully

### TC-G2 - Create Goal - missing title ❌

Test Case ID: TC-G2

Title: Create Goal with missing title

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
    "goalTitle": ""
    }

3. Expected Result
   Expected Status Code: Return 400 Bad Request

   Expected Response Body:
   - Not Allowed

4. Actual Result ❌
    200 OK
    {
    "id": 7,
    "goalTitle": ""
    }
    - DataBase updated successfully 

### TC-G3 - View All Goal ✅

Test Case ID: TC-G3

Title: View All Goal

Endpoint: GET /goals

1. Pre-conditions
    - Database is running and a number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
   HTTP Method: GET
   URL: http://localhost:8080/goals

3. Expected Result
   Expected Status Code: 200 K

   Expected Response Body:
    - Show Lists of Goals

4. Actual Result ✅

[
    {
    "id": 1,
    "goalTitle": "5k run less than 20min"
    },...
    {
    "id": 6,
    "goalTitle": "JavaScript Mastery"
    },
    {
    "id": 7,
    "goalTitle": ""
    }
]

### TC-G4 - Get Goal ID ✅

Test Case ID: TC-G4

Title: Get a valid Id of a Goal

Endpoint: GET /goals

1. Pre-conditions
    - Database is running and has a number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
   HTTP Method: POST
   URL: http://localhost:8080/goals/6

3. Expected Result
   Expected Status Code: 200 OK

   Expected Response Body:
   {
   "goalId": 6,
   "goalTitle": "JavaScript Mastery",
   "entries": []
   }

4. Actual Result ✅

   {
   "goalId": 6,
   "goalTitle": "JavaScript Mastery",
   "entries": []
   }

### TC-G5 - Get non-exist Id Goal ❌

Test Case ID: TC-G5

Title: Get an Id of goal that's not in the DataBase

Endpoint: GET /goals

1. Pre-conditions
    - Database is running and empty or has any number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
   HTTP Method: POST
   URL: http://localhost:8080/goals

Body:


3. Expected Result
   Expected Status Code:

   Expected Response Body:


4. Actual Result ✅


    - DataBase updated successfully 

### TC-G3 - Create Goal

Test Case ID: TC-G2

Title:

Endpoint: POST /goals

1. Pre-conditions
    - Database is running and empty or has any number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
   HTTP Method: POST
   URL: http://localhost:8080/goals

Body:


3. Expected Result
   Expected Status Code:

   Expected Response Body:


4. Actual Result ✅


    - DataBase updated successfully 

### TC-G3 - Create Goal

Test Case ID: TC-G2

Title:

Endpoint: POST /goals

1. Pre-conditions
    - Database is running and empty or has any number of goals.
    - API server is running
    - Content-Type = application/json

2. Input/Request
   HTTP Method: POST
   URL: http://localhost:8080/goals

Body:


3. Expected Result
   Expected Status Code:

   Expected Response Body:


4. Actual Result ✅


    - DataBase updated successfully 