import asyncHandler from "../middlewares/AsyncHandler";
import { CookieOptions, Request, Response } from "express";
import { Router } from "express";
import {
  dbUserCheckV2,
  dbUserDelete,
  validate,
} from "../middlewares/Validator";
import config from "../config";
import { Role, RoleEnum } from "../types";
import bcrypt from "bcrypt";
import { BadRequest } from "../customErrors";
import {
  generateJwtToken,
  getModelByRole,
  getUserByRole,
  removeFile,
  uploadLocal,
} from "../constants/lib";
import CONFIG from "../config";
import mongoose, { Model, modelNames } from "mongoose";
import { ObjectId } from "mongodb";
import { IBaseUser, IUser, IEmployee, Admin, ITicket, Employee, User, Ticket, Chat } from "../models";
import { userSchema,EmployeeSchema,ticketSchema,updateEmployeeSchema } from "../validators/zod";

const router = Router();




// @adminlogin
// @desc    Login admin
// @route   POST /api/v1/admin/login
router.post('/login', asyncHandler(async (req: Request, res: any) => {
    try{
        const { email, password } = req.body;

        const user = await Admin.findOne({ email });
        if (!user) {
           return res.status(400).json({ msg: "Invalid email" });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        };

        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        const token = generateJwtToken(tokenUser as any, RoleEnum.ADMIN);

        const options: CookieOptions = {
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
                role:'admin'
            }
        });


         

    }catch(err){
        console.log(err)
    }
   
}));


// @adminlogin
// Add Employee
// @desc    Add Employee
router.post('/addEmployee', asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate request with Zod
      const parsedData = EmployeeSchema.parse(req.body);
      const { name, email, password, phone,confirmPassword,admin } = parsedData;
  
      // Check if employee already exists
      const existing = await Employee.findOne({ email });
      if (existing) {
        return res.status(400).json({ msg: "Employee with this email already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(admin, 'getting admin')
  
  
      await Employee.create({
        name,
        email,
        password: hashedPassword,
        phone,
        confirmPassword:hashedPassword,
        admin:admin
      });
  
      res.status(201).json({
        success: true,
        msg: "Employee added successfully",
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ msg: err.message || "Error adding employee" });
    }
  }));



// get the employees all
router.get('/getEmployees/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find({admin:req.params.id}).populate('admin');
        
        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching employees" });
    }
}));


router.put('/updateEmployee/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Validate request with Zod (consider making a separate update schema)
      const parsedData = updateEmployeeSchema.parse(req.body); // Allow partial updates
      const { name, email, password, phone, confirmPassword, admin } = parsedData;

      // Find existing employee
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
        return res.status(404).json({ msg: "Employee not found" });
      }

      // Check email uniqueness if email is being updated
      if (email && email !== existingEmployee.email) {
        const emailExists = await Employee.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ msg: "Email already in use" });
        }
      }

      // Only hash password if it's being updated
      let hashedPassword = existingEmployee.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updateData = {
        name: name || existingEmployee.name,
        email: email || existingEmployee.email,
        password: hashedPassword,
        phone: phone || existingEmployee.phone,
      };

      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return updated document
      );

      res.status(200).json({
        success: true,
        msg: "Employee updated successfully",
        data: updatedEmployee
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ msg: err.message || "Error updating employee" });
    }
  }));

  // @desc    Update Admin
// @route   PUT /api/v1/admin/updateAdmin/:id
router.put('/updateAdmin/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Optionally validate using a schema
        const { name, email, password, phone, confirmPassword } = req.body;

        const existingAdmin = await Admin.findById(id);
        if (!existingAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        if (email && email !== existingAdmin.email) {
            const emailExists = await Admin.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }

        let hashedPassword = existingAdmin.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updateData = {
            name: name || existingAdmin.name,
            email: email || existingAdmin.email,
            phone: phone || existingAdmin.phone,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        };

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            msg: "Admin updated successfully",
            data: updatedAdmin,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating admin" });
    }
}));


// @desc    Update User
// @route   PUT /api/v1/user/updateUser/:id
router.put('/updateUser/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { name, lastName, email, password, phone, confirmPassword } = req.body;

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }

        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            phone: phone || existingUser.phone,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        };

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            msg: "User updated successfully",
            data: updatedUser,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating user" });
    }
}));

// delete the employee
router.delete('/deleteEmployee/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Delete the employee
        await Employee.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Employee deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting employee" });
    }
}));






// user reggister
// @desc    Register user
// @route   POST /api/v1/user/register
router.post('/adduser', asyncHandler(async (req: Request, res: Response) => {
    try {
        // Validate request with Zod
        console.log(req.body,'getting data')
        const parsedData = userSchema.parse(req.body);
        const { name, email, password, phone,lastName } = parsedData;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name,
            lastname:lastName,
            email,
            password: hashedPassword,
            phone,
            confirmPassword:hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            msg: "User added successfully",
            data: newUser,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error adding user" });
    }
}));



// add admin
router.post('/addadmin', asyncHandler(async (req: Request, res: Response) => {
    try {
        // Validate request with Zod
        console.log(req.body,'getting data')
        const parsedData = userSchema.parse(req.body);
        const { name, email, password, phone,lastName } = parsedData;

        // Check if user already exists
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new Admin({
            name,
            lastname:lastName,
            email,
            password: hashedPassword,
            phone,
            confirmPassword:hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            msg: "Admin added successfully",
            data: newUser,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error adding user" });
    }
}));




// user login
// @desc    Login user
router.post('/userlogin', asyncHandler(async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        };

        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        const token = generateJwtToken(tokenUser as any, RoleEnum.USER);

        const options: CookieOptions = {
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
                role:'user'
            }
        });


    }catch(err){
        console.log(err)
    }
}));




// employee Login
// @desc    Login employee
// unit testing completed
router.post('/employeelogin', asyncHandler(async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        };

        const tokenUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        const token = generateJwtToken(tokenUser as any, RoleEnum.EMPLOYEE);

        const options: CookieOptions = {
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
                role:'employee'
            }
        });

    }catch(err){
        console.log(err)
    }
}));



// get the users
// unit testing completed
router.get('/getusers', asyncHandler(async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching users" });
    }
}));



// rise a ticket
// ticket schema
// @desc    Create a ticket
router.post('/createTicket', asyncHandler(async (req: Request, res: Response) => {
    try {
        // Validate request with Zod
        const parsedData = ticketSchema.parse(req.body);
        console.log(parsedData,'getting data')
        const {  userId, employeeId, subject, description, status, priority } = parsedData;

        // Create and save the new ticket
        const newTicket = new Ticket({
            userId,
            employeeId,
            subject,
            description,
            status,
            priority
        });

        await newTicket.save();

        res.status(201).json({
            success: true,
            msg: "Ticket created successfully",
            data: newTicket,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error creating ticket" });
    }
}));



// update the ticket
// @desc    Update a ticket
router.put('/updateTicket/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Validate request with Zod
        const parsedData = ticketSchema.parse(req.body);
        const { userId, subject, description, status, priority } = parsedData;

        // Find existing ticket
        const existingTicket = await Ticket.findById(id);
        if (!existingTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }

        // Update the ticket
        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { userId, subject, description, status, priority },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: "Ticket updated successfully",
            data: updatedTicket,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error updating ticket" });
    }
}));


// delete the ticket
// @desc    Delete a ticket
router.delete('/deleteTicket/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if ticket exists
        const existingTicket = await Ticket.findById(id);
        if (!existingTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }

        // Delete the ticket
        await Ticket.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Ticket deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting ticket" });
    }
}));



// get the tickets open tickets
router.get('/getTickets', asyncHandler(async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.aggregate([
            {
                $match: {
                    status:'OPEN'
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
        ]) 
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
}));


// get all tickets
router.get('/getTicketsall', asyncHandler(async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                    }
                    },
        ]) 
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
}));




// SET THE EMPLOYEE
// @desc    Assign an employee to a ticket
router.put('/assignEmployee/:ticketId', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ticketId } = req.params;
        const { employeeId,status } = req.body;

        // Validate ticket ID
        if (!ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }

        // Update the ticket with the assigned employee
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { employeeId ,status},
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Employee assigned successfully",
            data: updatedTicket,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error assigning employee" });
    }
}));

// testing completed
router.get('/getTicketsassign', asyncHandler(async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.aggregate([
            {
                $match: {
                    status:'OPEN'
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
                   
        ]) 
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
}));


// get the users ticket
// unit testing completed
router.get('/getUserTickets/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tickets = await Ticket.find({ userId: id });
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
}));


// get the employee ticket
// testing completed
router.get('/getEmployeeTickets/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tickets = await Ticket.aggregate([
            {
                $match: {
                    employeeId: new ObjectId(id)
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching tickets" });
    }
}));



// update the employee status
// testing completed
router.put('/updateTicketStatus/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Ticket status updated successfully",
            data: ticket
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error updating ticket status" });
    }
}));



// chatting 
// @desc    Chat with employee
// group chat based on the ticket id 
router.post('/groupChat/:ticketId/:employeeid', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ticketId,employeeid } = req.params;
        const { message } = req.body;

        // Validate ticket ID
        if (!ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }

        // Create and save the new chat message
        const newChatMessage = new Chat({
            ticketId,
            text:message,
            employeeId:employeeid,
        });

        await newChatMessage.save();

        res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
}));

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

router.get('/getChat/:ticketId', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ticketId } = req.params;

        if (!ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        }

        const chatMessages = await Chat.aggregate([
            { $match: { ticketId: new ObjectId(ticketId) } },

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

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching chat messages" });
    }
}));



// chat userid 
router.post('/groupChatuser/:ticketId/:userid', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ticketId,userid } = req.params;
        const { message } = req.body;

        // Validate ticket ID
        if (!ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        };

        // Validate user ID
        if (!ObjectId.isValid(userid)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        };

        console.log(userid,'getting the user id');

        const newChatMessage = await Chat.create({
            ticketId,
            text:message,
            userId:userid,
        });
         
        return res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });

    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
}));


// chat the admin
router.post('/groupChatadmin/:ticketId/:adminid', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ticketId,adminid } = req.params;
        const { message } = req.body;

        // Validate ticket ID
        if (!ObjectId.isValid(ticketId)) {
            return res.status(400).json({ msg: "Invalid ticket ID" });
        };

        console.log(adminid,'getting the admin id');

        const newChatMessage = await Chat.create({
            ticketId,
            text:message,
            adminId:adminid,
        });
         
        return res.status(201).json({
            success: true,
            msg: "Chat message sent successfully",
            data: newChatMessage,
        });

       
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ msg: err.message || "Error sending chat message" });
    }
}));

function getISOWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    const diff = target.valueOf() - firstThursday.valueOf();
    return 1 + Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  }
  

router.get('/chatAnalytics', asyncHandler(async (req: Request, res: Response) => {
    try {
      const weeks = 11;
      const now = new Date();
      const startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000 * weeks)); // last 11 weeks
  
      // Group missed chats per week (using ticketId presence)
      const chatAggregation = await Chat.aggregate([
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
      const totalChats = await Chat.countDocuments();
  
      // Simulated resolved chats (e.g., if text includes 'resolved')
      const resolvedChats = await Chat.countDocuments({ text: /resolved/i });
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
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ msg: "Failed to fetch analytics" });
    }
  }));





// logout
// @desc    Logout user
// @route   POST /api/v1/user/logout
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            msg: "Logged out successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error logging out" });
    }
}));



export default router;