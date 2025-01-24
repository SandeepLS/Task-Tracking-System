const Team = require('../models/teamModel')

//Create a team:
exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Team name is required" });

        const team = await Team.create({
            name,
            description,
            members: [req.user.id], // Add creator as the first member
            createdBy: req.user.id,
        });

        res.status(201).json({ message: "Team created successfully", team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


//Invite a member:
exports.inviteMember = async (req, res) => {
    try {
        const { teamId, userId } = req.body;

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });

        // Ensure the inviter is a team member
        if (!team.members.includes(req.user.id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Add the new member
        if (!team.members.includes(userId)) {
            team.members.push(userId);
            await team.save();
        }

        res.status(200).json({ message: "Member invited successfully", team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
