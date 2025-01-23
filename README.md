TaskMaster: A Collaborative Task Tracking System:-

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

-> Create controllers/taskController.js:
Create: Post: http://localhost:3000/api/tasks
GetallTask: Get: http://localhost:3000/api/tasks
UpdateTask: Put: http://localhost:3000/api/tasks/:taskId
Delete: Delete: http://localhost:3000/api/tasks/:taskId
Comment: Post: http://localhost:3000/api/tasks/:taskId/comment

-> Create routes/taskRoutes.js:

-> Login as Sandeep, When Sandeep creates a task, to assign Sachin, After complete the task Who are created the task(Sandeep) only to delete the task.
And if Login as Sandeep, he can only updated task status(open, progress, complete).
And if Login as Sachin, he can view task, who are assigned to him.
And if Login as Sachin, he can give comment to, who posted/created(Sandeep) the task.
And if Login as Sachin, he can attach task file to who posted/created the task.


Task Assignment: Sandeep assigns the task to Sachin.
createdBy: Sandeep.
assignedTo: Sachin.

Adding Comments: Any user (e.g., Sachin) can add a comment. Their userId is linked to the comment in the comments array under the user field.
