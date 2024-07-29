# Cricket Squad

This API provides endpoints to manage teams and their associated players. Below is the documentation for each endpoint.

## Endpoints

### 1. Get All Teams

Retrieve a list of teams with their players. This endpoint will return a maximum of 5 teams.

- **Method**: `GET`
- **URL**: `{baseURL}/teams?offset=1&count=5`

**Query Parameters**:
- `offset` (optional): The starting point for fetching teams.
- `count` (optional): The number of teams to return (maximum 5).

**Response**:
- **200 OK**: Returns a list of teams with their players.

### 2. Get a Specific Team

Retrieve details of a specific team by its ID.

- **Method**: `GET`
- **URL**: `{baseURL}/teams/66a59b4f4ac250bb43a9d6d7`

**URL Parameters**:
- `teamId`: The ID of the team to retrieve (e.g., `66a59b4f4ac250bb43a9d6d7`).

**Response**:
- **200 OK**: Returns the team details.

### 3. Delete a Team

Remove a specific team by its ID.

- **Method**: `DELETE`
- **URL**: `{baseURL}/teams/66a59b9c4ac250bb43a9d6f1`

**URL Parameters**:
- `teamId`: The ID of the team to delete (e.g., `66a59b9c4ac250bb43a9d6f1`).

**Response**:
- **204 No Content**: Successfully deleted the team.
- **404 Not Found**: Team with the specified ID does not exist.

### 4. Partially Update a Team

Update specific fields of a team's data. At least one field in the request body is required.

- **Method**: `PATCH`
- **URL**: `{baseURL}/teams/66a59b4f4ac250bb43a9d6d7`

**URL Parameters**:
- `teamId`: The ID of the team to update (e.g., `66a59b4f4ac250bb43a9d6d7`).

**Request Body**:
```json
{
  "country": "Pakistan",
  "yearEstablished": 1947,
  "totalWorldCupWon": 1
}
