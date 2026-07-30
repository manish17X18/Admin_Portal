Controllers
->Users
1)createUser.js
Client (Postman/Frontend)
          │
          ▼
POST /createUser
          │
          ▼
Express Route
          │
          ▼
createUser Controller
          │
          ├── 1. Read req.body
          │
          ├── 2. Validate fields
          │       │
          │       ├── Missing? → Return 400
          │       └── Present → Continue
          │
          ├── 3. getAdminClient()
          │
          ├── 4. Search role in Keycloak
          │       │
          │       ├── Role not found → Return 400
          │       └── Role found → Continue
          │
          ├── 5. Create user in Keycloak
          │
          ├── 6. Assign role using
          │       addRealmRoleMappings()
          │
          ├── 7. Send Success Response (201)
          │
          └── Error?
                  │
                  ▼
              Catch Block
                  │
                  ▼
          Return 500


2)Fetch Users
Frontend
    │
    ▼
GET /users
    │
    ▼
getusers Controller
    │
    ▼
Connect to Keycloak
    │
    ▼
Fetch all users
    │
    ▼
Remove default admin account
    │
    ▼
For each remaining user
      │
      ├── Fetch user's roles
      │
      ├── If admin → Skip
      │
      ├── Remove system roles
      │
      ├── Create display name
      │
      └── Format user object
    │
    ▼
Return formatted users

3)Edit user
Frontend
     │
     ▼
PUT /editUser/:userId
     │
     ▼
editUser Controller
     │
     ▼
Authenticate with Keycloak
     │
     ▼
Get User ID
     │
     ▼
Check if user exists
     │
     ├── No → Return 400
     │
     └── Yes
          │
          ▼
Update Phone Number
          │
          ▼
Role provided?
      ┌───┴───────────┐
      │               │
     No              Yes
      │               │
      ▼               ▼
Return Success   Fetch Current Roles
                     │
                     ▼
            Remove Old Custom Role
                     │
                     ▼
              Find New Role
                     │
                     ▼
             Assign New Role
                     │
                     ▼
              Return Success

4) Delete User
Frontend
    │
    ▼
DELETE /deleteUser
    │
    ▼
deleteUser Controller
    │
    ▼
Read User ID
    │
    ▼
User ID Present?
 ┌──┴────────┐
 │           │
No          Yes
 │           │
400         ▼
      Authenticate with Keycloak
             │
             ▼
      Delete User
             │
             ▼
      Return Success
