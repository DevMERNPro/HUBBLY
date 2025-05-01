import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { useForm } from 'react-hook-form';
import '../Styles/requestFormTable.css'; // Assuming you have a CSS file for styles
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config';
import { useAuth } from './context';
import { toast } from 'sonner';

const RequestFormTable = () => {
  const initialRequests = [
    { id: 1, subject: 'Website Bug', description: 'Login button not working', priority: 'High' },
    { id: 2, subject: 'Feature Request', description: 'Add dark mode option', priority: 'Medium' },
    { id: 3, subject: 'Database Issue', description: 'Slow query performance', priority: 'High' },
  ];

  const { user } = useAuth();

  console.log(user.id, 'user in request form table');

  const [requests, setRequests] = useState(initialRequests);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();



  // getting tickets
  const getTickets = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/getUserTickets/${user.id}`);
      console.log(response.data,'getting data');
      setRequests(response.data.data);
      toast.success(response.data.message || response.data.msg, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          backgroundColor: "#4CAF50", // green background
          color: "#ffffff",            // white text
          border: "1px solid #3e8e41", // optional border
        },
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error(error?.response?.data?.message || error?.response?.data?.msg, {
        style: {
          backgroundColor: "#f44336", // Red background
          color: "#ffffff",           // White text
          border: "1px solid #d32f2f",// Optional dark red border
        },
        action: {
          label: "Dismiss",
          onClick: () => console.log("Error dismissed"),
        },
      });
    }
  };



  useEffect(() => {
    getTickets();
  }, []);


  const handleOpen = (request = null) => {
    if (request) {
      reset(request);
      setEditingId(request._id);
    } else {
      reset({ subject: '', description: '', priority: 'Medium' });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = async(data) => {
    if (editingId) {
      const response = await axios.put(`${config.BASE_URL}/updateTicket/${editingId}`, {
        userId: user.id,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        status: 'OPEN',
      });
      console.log(response);
      toast.success(response.data.message || response.data.msg, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          backgroundColor: "#4CAF50", // green background
          color: "#ffffff",            // white text
          border: "1px solid #3e8e41", // optional border
        },
      });
      reset();
      getTickets();
    
    } else {
      console.log(data,'getting data')
      const response = await axios.post(`${config.BASE_URL}/createTicket`, {
        userId:user.id,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        status: 'OPEN',
      });
      console.log(response);
      toast.success(response.data.message || response.data.msg, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          backgroundColor: "#4CAF50", // green background
          color: "#ffffff",            // white text
          border: "1px solid #3e8e41", // optional border
        },
      });
      reset();
      getTickets();
    }
    handleClose();
  };

  const handleDelete =async (id) => {
    try{
      const response = await axios.delete(`${config.BASE_URL}/deleteTicket/${id}`);

      console.log(response.data);

      toast.success(response.data.message || response.data.msg, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          backgroundColor: "#4CAF50", // green background
          color: "#ffffff",            // white text
          border: "1px solid #3e8e41", // optional border
        },
      });

      getTickets();

    }catch(error){
      console.error('Error deleting ticket:', error);
      toast.error(error?.response?.data?.message || error?.response?.data?.msg, {
        style: {
          backgroundColor: "#f44336", // Red background
          color: "#ffffff",           // White text
          border: "1px solid #d32f2f",// Optional dark red border
        },
        action: {
          label: "Dismiss",
          onClick: () => console.log("Error dismissed"),
        },
      });
    }
  };

  const paginatedRequests = requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="">
    <div className="request-container">
      <h2>Request Management</h2>

      <Button variant="contained" onClick={() => handleOpen()}>Add Request</Button>

      {/* Table */}
      <table className="requests-table" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.length === 0 ? (
            <tr><td colSpan="5">No requests found</td></tr>
          ) : (
            paginatedRequests.map((request,index) => (
              <tr key={request.id}>
                <td>{index+1}</td>
                <td>{request.subject}</td>
                <td>{request.description}</td>
                <td>{request.priority}</td>
                <td>
                  <Button onClick={() => handleOpen(request)}>Edit</Button>
                  <Button onClick={() => handleDelete(request._id)} color="error">Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <span>Rows per page: </span>
        <Select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        >
          {[5, 10, 15].map(n => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>

        <Button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>Prev</Button>
        <Button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * rowsPerPage >= requests.length}>Next</Button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? 'Edit Request' : 'Add New Request'}</DialogTitle>
        <DialogContent>
          <form id="request-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Subject"
              fullWidth
              margin="dense"
              {...register("subject", { required: "Subject is required" })}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              {...register("description", { required: "Description is required" })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Priority</InputLabel>
              <Select
                defaultValue="Medium"
                label="Priority"
                {...register("priority")}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="request-form" variant="contained">
            {editingId ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
};

export default RequestFormTable;
