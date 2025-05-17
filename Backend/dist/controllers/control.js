"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncHandler_1 = __importDefault(require("../middlewares/AsyncHandler"));
const express_1 = require("express");
const types_1 = require("../types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const lib_1 = require("../constants/lib");
const mongodb_1 = require("mongodb");
const models_1 = require("../models");
const zod_1 = require("../validators/zod");
const router = (0, express_1.Router)();
// @adminlogin
// @desc    Login admin
// @route   POST /api/v1/admin/login
router.post('/login', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }
        ;
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        ;
        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        const token = (0, lib_1.generateJwtToken)(tokenUser, types_1.RoleEnum.ADMIN);
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options);
        res.status(200).json({
            success: true,
            token,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'admin'
            }
        });
    }
    catch (err) {
        console.log(err);
    }
})));
// @adminlogin
// Add Employee
// @desc    Add Employee
router.post('/addEmployee', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request with Zod
        const parsedData = zod_1.EmployeeSchema.parse(req.body);
        const { name, email, password, phone, confirmPassword, admin } = parsedData;
        // Check if employee already exists
        const existing = yield models_1.Employee.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "Employee with this email already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log(admin, 'getting admin');
        yield models_1.Employee.create({
            name,
            email,
            password: hashedPassword,
            phone,
            confirmPassword: hashedPassword,
            admin: admin
        });
        res.status(201).json({
            success: true,
            msg: "Employee added successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error adding employee" });
    }
})));
// get the employees all
router.get('/getEmployees/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield models_1.Employee.find({ admin: req.params.id }).populate('admin');
        res.status(200).json({
            success: true,
            data: employees
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching employees" });
    }
})));
router.put('/updateEmployee/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate request with Zod (consider making a separate update schema)
        const parsedData = zod_1.updateEmployeeSchema.parse(req.body); // Allow partial updates
        const { name, email, password, phone, confirmPassword, admin } = parsedData;
        // Find existing employee
        const existingEmployee = yield models_1.Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        // Check email uniqueness if email is being updated
        if (email && email !== existingEmployee.email) {
            const emailExists = yield models_1.Employee.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }
        // Only hash password if it's being updated
        let hashedPassword = existingEmployee.password;
        if (password) {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        const updateData = {
            name: name || existingEmployee.name,
            email: email || existingEmployee.email,
            password: hashedPassword,
            phone: phone || existingEmployee.phone,
        };
        const updatedEmployee = yield models_1.Employee.findByIdAndUpdate(id, updateData, { new: true } // Return updated document
        );
        res.status(200).json({
            success: true,
            msg: "Employee updated successfully",
            data: updatedEmployee
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating employee" });
    }
})));
// @desc    Update Admin
// @route   PUT /api/v1/admin/updateAdmin/:id
router.put('/updateAdmin/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Optionally validate using a schema
        const { name, email, password, phone, confirmPassword } = req.body;
        const existingAdmin = yield models_1.Admin.findById(id);
        if (!existingAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        if (email && email !== existingAdmin.email) {
            const emailExists = yield models_1.Admin.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }
        let hashedPassword = existingAdmin.password;
        if (password) {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        const updateData = {
            name: name || existingAdmin.name,
            email: email || existingAdmin.email,
            phone: phone || existingAdmin.phone,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        };
        const updatedAdmin = yield models_1.Admin.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({
            success: true,
            msg: "Admin updated successfully",
            data: updatedAdmin,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating admin" });
    }
})));
// @desc    Update User
// @route   PUT /api/v1/user/updateUser/:id
router.put('/updateUser/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, lastName, email, password, phone, confirmPassword } = req.body;
        const existingUser = yield models_1.User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (email && email !== existingUser.email) {
            const emailExists = yield models_1.User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }
        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            phone: phone || existingUser.phone,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        };
        const updatedUser = yield models_1.User.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({
            success: true,
            msg: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating user" });
    }
})));
// delete the employee
router.delete('/deleteEmployee/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if employee exists
        const existingEmployee = yield models_1.Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        // Delete the employee
        yield models_1.Employee.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            msg: "Employee deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting employee" });
    }
})));
// user reggister
// @desc    Register user
// @route   POST /api/v1/user/register
router.post('/adduser', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request with Zod
        console.log(req.body, 'getting data');
        const parsedData = zod_1.userSchema.parse(req.body);
        const { name, email, password, phone, lastName } = parsedData;
        // Check if user already exists
        const existing = yield models_1.User.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create and save the new user
        const newUser = new models_1.User({
            name,
            lastname: lastName,
            email,
            password: hashedPassword,
            phone,
            confirmPassword: hashedPassword
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            msg: "User added successfully",
            data: newUser,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error adding user" });
    }
})));
// add admin
router.post('/addadmin', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request with Zod
        console.log(req.body, 'getting data');
        const parsedData = zod_1.userSchema.parse(req.body);
        const { name, email, password, phone, lastName } = parsedData;
        // Check if user already exists
        const existing = yield models_1.Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create and save the new user
        const newUser = new models_1.Admin({
            name,
            lastname: lastName,
            email,
            password: hashedPassword,
            phone,
            confirmPassword: hashedPassword
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            msg: "Admin added successfully",
            data: newUser,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error adding user" });
    }
})));
// user login
// @desc    Login user
router.post('/userlogin', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }
        ;
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        ;
        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        const token = (0, lib_1.generateJwtToken)(tokenUser, types_1.RoleEnum.USER);
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options);
        res.status(200).json({
            success: true,
            token,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'user'
            }
        });
    }
    catch (err) {
        console.log(err);
    }
})));
// employee Login
// @desc    Login employee
// unit testing completed
router.post('/employeelogin', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.Employee.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }
        ;
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        ;
        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        const token = (0, lib_1.generateJwtToken)(tokenUser, types_1.RoleEnum.EMPLOYEE);
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options);
        res.status(200).json({
            success: true,
            token,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'employee'
            }
        });
    }
    catch (err) {
        console.log(err);
    }
})));
// get the users
// unit testing completed
router.get('/getusers', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching users" });
    }
})));
// rise a ticket
// ticket schema
// @desc    Create a ticket
router.post('/createTicket', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request with Zod
        const parsedData = zod_1.ticketSchema.parse(req.body);
        console.log(parsedData, 'getting data');
        const { userId, employeeId, subject, description, status, priority } = parsedData;
        // Create and save the new ticket
        const newTicket = new models_1.Ticket({
            userId,
            employeeId,
            subject,
            description,
            status,
            priority
        });
        yield newTicket.save();
        res.status(201).json({
            success: true,
            msg: "Ticket created successfully",
            data: newTicket,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error creating ticket" });
    }
})));
// update the ticket
// @desc    Update a ticket
router.put('/updateTicket/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate request with Zod
        const parsedData = zod_1.ticketSchema.parse(req.body);
        const { userId, subject, description, status, priority } = parsedData;
        // Find existing ticket
        const existingTicket = yield models_1.Ticket.findById(id);
        if (!existingTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }
        // Update the ticket
        const updatedTicket = yield models_1.Ticket.findByIdAndUpdate(id, { userId, subject, description, status, priority }, { new: true });
        res.status(200).json({
            success: true,
            msg: "Ticket updated successfully",
            data: updatedTicket,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating ticket" });
    }
})));
// delete the ticket
// @desc    Delete a ticket
router.delete('/deleteTicket/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if ticket exists
        const existingTicket = yield models_1.Ticket.findById(id);
        if (!existingTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }
        // Delete the ticket
        yield models_1.Ticket.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            msg: "Ticket deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting ticket" });
    }
})));
// get the tickets open tickets
router.get('/getTickets', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield models_1.Ticket.aggregate([
            {
                $match: {
                    status: 'OPEN'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
        ]);
        res.status(200).json({
            success: true,
            data: tickets
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
})));
// get all tickets
router.get('/getTicketsall', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield models_1.Ticket.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
        ]);
        res.status(200).json({
            success: true,
            data: tickets
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
})));
// SET THE EMPLOYEE
// @desc    Assign an employee to a ticket
router.put('/assignEmployee/:ticketId', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        const { employeeId, status } = req.body;
        // Validate ticket ID
        if (!mongodb_1.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }
        // Update the ticket with the assigned employee
        const updatedTicket = yield models_1.Ticket.findByIdAndUpdate(ticketId, { employeeId, status }, { new: true });
        if (!updatedTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }
        res.status(200).json({
            success: true,
            msg: "Employee assigned successfully",
            data: updatedTicket,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error assigning employee" });
    }
})));
// testing completed
router.get('/getTicketsassign', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield models_1.Ticket.aggregate([
            {
                $match: {
                    status: 'OPEN'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employeeId'
                }
            },
        ]);
        res.status(200).json({
            success: true,
            data: tickets
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
})));
// get the users ticket
// unit testing completed
router.get('/getUserTickets/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tickets = yield models_1.Ticket.find({ userId: id });
        res.status(200).json({
            success: true,
            data: tickets
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
})));
// get the employee ticket
// testing completed
router.get('/getEmployeeTickets/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tickets = yield models_1.Ticket.aggregate([
            {
                $match: {
                    employeeId: new mongodb_1.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: tickets
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
})));
// update the employee status
// testing completed
router.put('/updateTicketStatus/:id', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ticket = yield models_1.Ticket.findByIdAndUpdate(id, { status }, { new: true });
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }
        res.status(200).json({
            success: true,
            msg: "Ticket status updated successfully",
            data: ticket
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error updating ticket status" });
    }
})));
// chatting 
// @desc    Chat with employee
// group chat based on the ticket id 
router.post('/groupChat/:ticketId/:employeeid', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId, employeeid } = req.params;
        const { message } = req.body;
        // Validate ticket ID
        if (!mongodb_1.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }
        // Create and save the new chat message
        const newChatMessage = new models_1.Chat({
            ticketId,
            text: message,
            employeeId: employeeid,
        });
        yield newChatMessage.save();
        res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
})));
// get the chat messages
// router.get('/getChat/:ticketId', asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const { ticketId } = req.params;
//         // Validate ticket ID
//         if (!ObjectId.isValid(ticketId)) {
//             return res.status(400).json({ msg: "Invalid ticket ID" });
//         }
//         const chatMessages = await Chat.find({ ticketId });
//         res.status(200).json({
//             success: true,
//             data: chatMessages
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Error fetching chat messages" });
//     }
// }));
router.get('/getChat/:ticketId', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        if (!mongodb_1.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }
        const chatMessages = yield models_1.Chat.aggregate([
            { $match: { ticketId: new mongodb_1.ObjectId(ticketId) } },
            // Lookup user
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            // Lookup employee
            {
                $lookup: {
                    from: "employees",
                    localField: "employeeId",
                    foreignField: "_id",
                    as: "employeeInfo"
                }
            },
            // Lookup admin
            {
                $lookup: {
                    from: "admins",
                    localField: "adminId",
                    foreignField: "_id",
                    as: "adminInfo"
                }
            },
            // Add a `sender` field depending on which info is available
            {
                $addFields: {
                    sender: {
                        $cond: [
                            { $gt: [{ $size: "$userInfo" }, 0] }, { $arrayElemAt: ["$userInfo", 0] },
                            {
                                $cond: [
                                    { $gt: [{ $size: "$employeeInfo" }, 0] }, { $arrayElemAt: ["$employeeInfo", 0] },
                                    { $arrayElemAt: ["$adminInfo", 0] }
                                ]
                            }
                        ]
                    }
                }
            },
            // Optional: remove the extra arrays if not needed
            {
                $project: {
                    userInfo: 0,
                    employeeInfo: 0,
                    adminInfo: 0
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: chatMessages
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching chat messages" });
    }
})));
// chat userid 
router.post('/groupChatuser/:ticketId/:userid', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId, userid } = req.params;
        const { message } = req.body;
        // Validate ticket ID
        if (!mongodb_1.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }
        ;
        // Validate user ID
        if (!mongodb_1.ObjectId.isValid(userid)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }
        ;
        console.log(userid, 'getting the user id');
        const newChatMessage = yield models_1.Chat.create({
            ticketId,
            text: message,
            userId: userid,
        });
        return res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
})));
// chat the admin
router.post('/groupChatadmin/:ticketId/:adminid', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId, adminid } = req.params;
        const { message } = req.body;
        // Validate ticket ID
        if (!mongodb_1.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }
        ;
        console.log(adminid, 'getting the admin id');
        const newChatMessage = yield models_1.Chat.create({
            ticketId,
            text: message,
            adminId: adminid,
        });
        return res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
})));
function getISOWeekNumber(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    const diff = target.valueOf() - firstThursday.valueOf();
    return 1 + Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}
router.get('/chatAnalytics', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const weeks = 11;
        const now = new Date();
        const startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000 * weeks)); // last 11 weeks
        // Group missed chats per week (using ticketId presence)
        const chatAggregation = yield models_1.Chat.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $isoWeek: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // Fill all 11 weeks with data (0 if missing)
        const currentWeek = getISOWeekNumber(now);
        const missedChats = Array.from({ length: weeks }, (_, i) => {
            const week = currentWeek - (weeks - 1 - i);
            const entry = chatAggregation.find(w => w._id === week);
            return entry ? entry.count : 0;
        });
        // Total chats count
        const totalChats = yield models_1.Chat.countDocuments();
        // Simulated resolved chats (e.g., if text includes 'resolved')
        const resolvedChats = yield models_1.Chat.countDocuments({ text: /resolved/i });
        const resolvedRate = totalChats ? Math.round((resolvedChats / totalChats) * 100) : 0;
        // Simulated average reply time (replace with actual logic if available)
        const avgReplyTime = "0 SECS";
        res.status(200).json({
            success: true,
            missedChats,
            totalChats,
            resolvedRate,
            avgReplyTime
        });
    }
    catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ msg: "Failed to fetch analytics" });
    }
})));
// logout
// @desc    Logout user
// @route   POST /api/v1/user/logout
router.post('/logout', (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            msg: "Logged out successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error logging out" });
    }
})));
exports.default = router;
