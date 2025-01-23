const Task = require('../models/taskModel');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body;

    if (!title || !description || !dueDate || !assignedTo) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: req.user.id,
        });
        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    const { status, search, sort } = req.query;

    try {
        // console.log('User ID from token:', req.user.id);

        let query = { assignedTo: req.user.id }; // Fetch tasks assigned to the logged-in user

        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: 'i' };

        // console.log('Query:', query);

        const tasks = await Task.find(query)
            .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        
        if (!tasks || tasks.length === 0) {
            console.log('No tasks found');
            return res.status(404).json({ message: 'No tasks found' });
        }
        
        // console.log('Tasks:', tasks);
        return res.status(200).json(tasks);

    } catch (error) {
        // console.error('Error fetching tasks:', error);
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

// (Sachin)Adding Comment to, who posted(Sandeep) the task
exports.addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { comment } = req.body;

        // Ensure comment is not empty
        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        // Add comment to the task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Push new comment
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
