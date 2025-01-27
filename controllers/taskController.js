const Task = require('../models/taskModel');
const Team = require('../models/teamModel')

// Create a new task
// exports.createTask = async (req, res) => {
//     const { title, description, dueDate, assignedTo } = req.body;

//     if (!title || !description || !dueDate || !assignedTo) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const task = await Task.create({
//             title,
//             description,
//             dueDate,
//             assignedTo,
//             createdBy: req.user.id,
//         });
//         return res.status(201).json({ message: 'Task created successfully', task });
//     } catch (error) {
//         return res.status(500).json({ message: 'Server error', error });
//     }
// };

// Create a new task, with or without a teamId.
exports.createTask = async (req, res) => {
    const { title, description, dueDate, assignedTo, teamId } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !assignedTo) {
        return res.status(400).json({ message: 'All fields (title, description, dueDate, assignedTo) are required' });
    }

    try {
        // If a teamId is provided, validate the team context
        if (teamId) {
            const team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }

            // Check if the user creating the task is a member of the team
            const isCreatorMember = team.members.includes(req.user.id);
            if (!isCreatorMember) {
                return res.status(403).json({ message: 'You must be a member of the team to create a task in this team' });
            }

            // Check if the assigned user is a member of the team, if not first we have to invite in team
            const isAssigneeMember = team.members.includes(assignedTo);
            if (!isAssigneeMember) {
                return res.status(400).json({ message: 'Assigned user is not a member of the team' });
            }
        }

        // Create the task (teamId is optional)
        const task = await Task.create({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: req.user.id,
            teamId: teamId || null, // Associate task with the team if provided
        });

        // If teamId is provided, optionally add the task to the team's task list
        if (teamId) {
            const team = await Team.findById(teamId);
            team.tasks.push(task._id);
            await team.save();
        }

        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Get all tasks
// exports.getTasks = async (req, res) => {
//     const { status, search, sort } = req.query;

//     try {
//         // console.log('User ID from token:', req.user.id);

//         let query = { assignedTo: req.user.id }; // Fetch tasks assigned to the logged-in user

//         if (status) query.status = status;
//         if (search) query.title = { $regex: search, $options: 'i' };

//         // console.log('Query:', query);

//         const tasks = await Task.find(query)
//             .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
//             .populate('assignedTo', 'name email')
//             .populate('createdBy', 'name email');
        
//         if (!tasks || tasks.length === 0) {
//             // console.log('No tasks found');
//             return res.status(404).json({ message: 'No tasks found' });
//         }
        
//         // console.log('Tasks:', tasks);
//         return res.status(200).json(tasks);

//     } catch (error) {
//         // console.error('Error fetching tasks:', error);
//         return res.status(500).json({ message: 'Server error', error });
//     }
// };

// Get tasks with filtering, sorting, and searching
exports.getTasks = async (req, res) => {
    try {
        const { status, assignedTo, createdBy, search, sortBy, order = 'asc' } = req.query;

        const query = { assignedTo: req.user.id }; //Default

        if (status) {
            query.status = status;
        }

        if (assignedTo) {
            query.assignedTo = assignedTo;
        }
        if (createdBy) {
            query.createdBy = createdBy;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Sorting
        const sortCriteria = {};
        if (sortBy) {
            sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortCriteria.createdAt = -1; // Default: newest tasks first
        }

        // Fetch tasks based on the query
        const tasks = await Task.find(query)
            .sort(sortCriteria)
            .populate('assignedTo', 'name email') // Populate assigned user details
            .populate('createdBy', 'name email'); // Populate creator details

        // If no tasks found, return 404
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }


        // Return tasks
        return res.status(200).json({
            message: "Tasks retrieved successfully.",
            tasks,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;

        await task.save();
        return res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params; // Task ID from the URL

    try {
        // Find the task by ID
        const task = await Task.findById(id);

        // If the task doesn't exist
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the logged-in user is the creator of the task
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: Only the task creator can delete this task' });
        }

        // Delete the task using deleteOne()
        await Task.deleteOne({ _id: id }); 

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error); // Log error for debugging
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Add Comment, with or without a teamId.
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params; // Task ID from the URL
        const { comment } = req.body; // Comment text from the request body

        // Ensure comment is not empty
        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        // Find the task by ID
        const task = await Task.findById(id).populate('teamId'); // Populate teamId for verification

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // If the task is associated with a team, verify membership
        if (task.teamId) {
            const isMember = task.teamId.members.includes(req.user.id);
            if (!isMember) {
                return res.status(403).json({ message: "You must be a team member to comment on this task." });
            }
        }

        // Add the comment
        task.comments.push({
            user: req.user.id, // req.user.id is the ID of the logged-in user
            comment,
        });

        await task.save();

        res.status(201).json({
            message: "Comment added successfully.",
            comments: task.comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.addAttachment = async (req, res) => {
    try {
        const { id } = req.params; // Task ID from the URL
        const { attachmentUrl } = req.body; // Attachment URL from the request body

        // Ensure attachmentUrl is provided
        if (!attachmentUrl) {
            return res.status(400).json({ message: "Attachment URL is required." });
        }

        // Find the task by ID
        const task = await Task.findById(id).populate('teamId'); // Populate teamId for verification

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // If the task is associated with a team, verify membership
        if (task.teamId) {
            const isMember = task.teamId.members.includes(req.user.id);
            if (!isMember) {
                return res.status(403).json({ message: "You must be a team member to add an attachment to this task." });
            }
        }

        // Add the attachment URL to the task
        task.attachments.push({
            user: req.user.id,
            attachmentUrl,
        });

        await task.save();

        res.status(201).json({
            message: "Attachment added successfully.",
            attachments: task.attachments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

//Include features for task filtering, sorting, and searching.
exports.getTaskFilter = async (req, res) => {
    try {
        const { status, assignedTo, createdBy, search, sortBy, order = 'asc' } = req.query;

        // Build the query object dynamically
        const query = {};

        // Filter by status (open, in-progress, completed)
        if (status) {
            query.status = status;
        }

        // Filter by assigned user
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        // Filter by creator
        if (createdBy) {
            query.createdBy = createdBy;
        }

        // Search in title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Sorting
        let sortCriteria = {};
        if (sortBy) {
            sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortCriteria.createdAt = -1; // Default sorting: newest first
        }

        // Execute the query
        const tasks = await Task.find(query).sort(sortCriteria).populate('assignedTo', 'name').populate('createdBy', 'name');

        res.status(200).json({
            message: "Tasks retrieved successfully.",
            tasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};
