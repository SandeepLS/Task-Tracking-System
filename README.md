TaskMaster: A Collaborative Task Tracking System:- Backend Part

User stories:
> 1. As a user, I want to be able to create a new account so that I can access the task tracking platform.
> 2. As a user, I want to log in to my account securely using my credentials.
> 3. As a user, I want to view my profile and update my personal information.
> 4. As a user, I want to create a new task with a title, description, and due date.
> 5. As a user, I want to view a list of all tasks assigned to me.
> 6. As a user, I want to mark a task as completed when I finish working on it.
> 7. As a user, I want to assign a task to another team member.
> 8. As a user, I want to filter tasks based on their status (e.g., open, completed).
> 9. As a user, I want to search for tasks by title or description.
> 10. As a user, I want to collaborate with team members by adding comments and attachments to tasks.
> 11. As a user, I want to create a new team or project and invite team members to join.
> 12. As a user, I want to securely log out of my account when I'm done using the platform.
> 13. (Optional Extension) As a user, I want to receive notifications when a task is assigned to me or updated. (Implement real-time notifications using WebSockets or Server-Sent Events)
> 14. (Optional but good to have) As a user, I want to integrate a generative AI model to automatically generate task descriptions or summaries based on user input, reducing manual effort in task creation.


Step 1:- Project Setup:
npm init
npm i express, dotenv
npm install nodemon --save-dev
git init, git status

Create files:- app.js, .env, .gitignore

Add a start script to package.json:-
"scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
}

npm run start
npm run dev

MongoDB:-
npm i mongoose
Create files:- config/db.js.
Then enter url in .env
process.exit(1); // Terminate the application with an error code

--------------------------------------------------------------------
Step 2: User Authentication and Management
Implement secure user authentication and authorization.
Provide endpoints for user registration, login, and profile management.
Use secure password hashing and consider implementing JWT for session management.

> 1. As a user, I want to be able to create a new account so that I can access the task tracking platform.
> 2. As a user, I want to log in to my account securely using my credentials.
> 3. As a user, I want to view my profile and update my personal information.

Install Required Dependencies:
npm install bcryptjs jsonwebtoken express-validator

-> models/userModel.js:
{ timestamps: true }:- option in a Mongoose schema is used to automatically add two fields to the document:
createdAt: Records the date and time when the document was first created in the database.
updatedAt: Records the date and time when the document was last updated in the database.

Without:- { timestamps: true }
We have to write manually in the schema:-
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now },

-> controllers/authController.js:
-> routes/authRoutes.js:
Why Use express-validator?
express-validator is a library for validating and sanitizing user inputs in an Express.js application. It helps ensure that the data received from users is clean, safe, and adheres to specific requirements, which is critical for building secure and robust applications.

-> npm i cors
cors middleware in your app.js file, before defining any routes. This ensures that all incoming requests go through the cors middleware first, enabling cross-origin requests between your frontend and backend.

-------------------------------------------------------
Step 3:- Task Management:
Design a data model for tasks with attributes like title, description, and due date.
Implement CRUD operations for tasks.
Include features for task filtering, sorting, and searching.

-> Create models/taskModel.js:
When creating a task:
{
  "title": "Complete the project",
  "description": "Finish the backend implementation",
  "dueDate": "2025-02-01",
  "status": "open",
  "assignedTo": "userId2",   // Refers to the user "Jane Smith"
  "createdBy": "userId1"     // Refers to the user "John Doe"
}

comments Array:
{
    "_id": "taskId123",
    "title": "Complete the project",
    "comments": [
        {
            "user": "userId1",
            "comment": "I have started working on this task.",
            "createdAt": "2025-01-20T10:00:00Z"
        },
        {
            "user": "userId2",
            "comment": "I will handle the database setup.",
            "createdAt": "2025-01-21T14:00:00Z"
        }
    ]
}

attachments Array:
attachments: [String]  // URLs or file paths to attachments
{
    "_id": "taskId123",
    "title": "Complete the project",
    "attachments": [
        "http://example.com/files/design.png",
        "http://example.com/files/requirements.docx"
    ]
}

> 7. As a user, I want to assign a task to another team member.
// Create a new task, with or without a teamId. authController.js:

-> Create controllers/taskController.js:
> 4. As a user, I want to create a new task with a title, description, and due date.
> 5. As a user, I want to view a list of all tasks assigned to me.
> 6. As a user, I want to mark a task as completed when I finish working on it.

Create: Post: http://localhost:3000/api/tasks
GetallTask: Get: http://localhost:3000/api/tasks
UpdateTask: Put: http://localhost:3000/api/tasks/:taskId
Delete: Delete: http://localhost:3000/api/tasks/:taskId
Comment: Post: http://localhost:3000/api/tasks/679330752389f7279d0da40b(:taskId)/comment
Attachment: Post: http://localhost:3000/api/tasks/679330752389f7279d0da40b/attachment

-> Login as Sandeep, When Sandeep creates a task, to assign Sachin, After complete the task Who are created the task(Sandeep) only to delete the task.
And if Login as Sandeep, he can view his task, if other user assigned task to Sandeep.
And if Login as Sandeep, he can only updated task status(open, in-progress, complete).
And if Login as Sandeep, he can only delete the task.
And if Login as Sachin, he can give comment to, who posted/created(Sandeep) the task.
And if Login as Sachin, he can attachment task file to who posted/created the task.

Task Assignment: Sandeep assigns the task to Sachin.
createdBy: Sandeep.
assignedTo: Sachin.
Adding Comments: Any user (e.g., Sachin) can add a comment. Their userId is linked to the comment in the comments array under the user field.

-> Create routes/taskRoutes.js:

> 8 And 9. As a user, I want to search for tasks by title or description.
-> Include features for task filtering, sorting, and searching.
1.Fetch tasks assigned to the logged-in user:
  GET http://localhost:3000/api/tasks
2.Filter by status (e.g., open):
  GET http://localhost:3000/api/tasks?status=open
3.Search for tasks by title or description:
  GET http://localhost:3000/api/tasks?search=<title>
4.Sort by due date (ascending):
  GET http://localhost:3000/api/tasks?sortBy=dueDate&order=asc
5.Combined Example: Fetch tasks assigned to a specific user, filtered by status, and sorted by due date:
  GET http://localhost:3000/api/tasks?assignedTo=<userId>&status=open&sortBy=dueDate&order=desc

How It Works
1.Default Behavior:
  If no query parameters are provided, it fetches tasks assigned to the logged-in user (req.user.id).
2.Filtering Options:
  status → Filters tasks by their status (open, in-progress, completed).
  assignedTo → Fetches tasks assigned to a specific user (if specified).
  createdBy → Fetches tasks created by a specific user (if specified).
3.Searching:
  Search tasks by title or description using the search query parameter.
4.Sorting:
  Sort by any field (e.g., dueDate, createdAt) using sortBy.
  Specify the sorting order (asc or desc) with the order parameter.

Advantages of This Solution:-
> Unified logic for fetching, filtering, sorting, and searching.
> Dynamic query building ensures flexibility and scalability.
> Handles both specific (assignedTo: req.user.id) and general filtering requirements.


------------------------------------------------------------
Step-4:- Team/Project Collaboration:
As a user, I want to create a new team or project and invite team members to join.
As a user, I want to assign a task to another team member.

->models/teamModel.js:-

->controllers/teamController.js:-
POST: http://localhost:3000/api/teams
    > Body:{
    "name": "Development Team",
    "description": "Team responsible for backend development"
    }
POST: http://localhost:3000/api/teams/invite
    {
        "teamId": "6793719c5ad635d40928a3b5",
        "userId": "678fa2d8bd84184b04304059"
    }


->controllers/taskController.js:-

> 11. As a user, I want to create a new team or project and invite team members to join.
> User(Nicky) can create new team
> User can invite another user, to the team, And he will become a member of the team.
> Nicky can create new task, for existing team using teamId.

> 10. As a user, I want to collaborate with team members by adding comments and attachments to tasks.
> If a user adding comment/attachment to the team task, he must be member of the team. if not get-error message.
  const task = await Task.findById(id).populate('teamId'); // Populate teamId for verification
  // If the task is associated with a team, verify membership
  if (task.teamId) {
      const isMember = task.teamId.members.includes(req.user.id);
        if (!isMember) {
          return res.status(403).json({ message: "You must be a team member to comment on this task." });
        }
  }
The .populate() method is a Mongoose function that replaces a referenced ObjectId field (in this case, teamId) with the actual document it references.
The teamId in the Task schema is defined as a reference to the Team model. Using .populate('teamId') allows us to fetch the complete Team document associated with the task.

> 12. As a user, I want to securely log out of my account when I'm done using the platform.
Create a new file models/blacklistModel.js:
Updated authController.js: logout Controller
middlewares/blacklistMiddleware.js:
Updated authMiddleware.js: Update the authMiddleware to Use checkBlacklist
Updated authRoute.js: router.post('/logout', authMiddleware, logoutUser);

Endpoint: POST /api/auth/logout
Headers:
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
