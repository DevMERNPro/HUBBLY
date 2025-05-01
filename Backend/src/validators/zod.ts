import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const EmployeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    admin:z.string().optional(),
    phone: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).refine((data) => {
    if (data.confirmPassword !== undefined) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  export const updateEmployeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    admin:z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
   });


  export const ticketSchema = z.object({
    userId: z.string().min(1, "User ID is required"), // Must be a valid ObjectId in real use
    employeeId: z.string().optional(), // Optional for ticket creation
    subject: z.string().min(1, "Subject is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional().default("OPEN"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("LOW"),
  });
  

  
