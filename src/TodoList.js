import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Box,
    Modal,
    Button,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TodoListTable() {

    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState({ key: "name", asc: true });
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", department: "", location: "" });
    const [selectedId,setSelectedId] = useState('')

    useEffect(()=>{
        getMembersData()
    },[])

    const showToast = (type, message) => {
        if(type === 'success'){
            toast.success(message);
        }else{
            toast.error(message);
        }
  };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = data?.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                r.department.toLowerCase().includes(q) ||
                r.location.toLowerCase().includes(q)
        );

        const sorted = [...list].sort((a, b) => {
            const A = String(a[sortBy.key]).toLowerCase();
            const B = String(b[sortBy.key]).toLowerCase();
            if (A === B) return 0;
            if (sortBy.asc) return A > B ? 1 : -1;
            return A > B ? -1 : 1;
        });

        return sorted;
    }, [data, query, sortBy]);

    function toggleSort(key) {
        setSortBy((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }));
    }

    function handleOpen() {
        setOpen(true);
    }


    function handleClose() {
        setOpen(false);
        setForm({ name: "", department: "", location: "" });
    }

const getMembersData = async () => {
    try {
        const token = localStorage.getItem('token')
      const res = await axios.get("https://mern-fullstack-project-navy.vercel.app/table-data/members",{
            headers: {
            "Authorization": `Bearer ${token}`
            }
            });
         setData(res.data)
    } catch (err) {
    console.log(err.response?.data?.message || "Fetched failed!")
    }
  };


    async function handleSubmit() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post("https://mern-fullstack-project-navy.vercel.app/table-data/members", form, {
            headers: {
            "Authorization": `Bearer ${token}`
            }
            });
             showToast('success',res.data.message || "Fetched successful!")
            handleClose();
            getMembersData()
        } catch (err) {
            console.log(err.response?.data?.message || "Login failed!");
            showToast('error',err.response?.data?.message || "Fetched failed!")
        }
    }
        async function handleDataUpdate() {
        try {
            const res = await axios.put("https://mern-fullstack-project-navy.vercel.app/table-data/"+selectedId, { id: selectedId, ...form });
             showToast('success',res.data.message || "Fetched successful!")
            handleClose();
            getMembersData()
            setSelectedId('')
        } catch (err) {
            console.log(err.response?.data?.message || "Login failed!");
            showToast('error',err.response?.data?.message || "Fetched failed!")
        }
    }

    function handleUpdate(row){
        setForm({...row})
        setSelectedId(row.id)
        handleOpen()
    }

    const deletuser = async (id) => {
        try {
            const res = await axios.delete(`https://mern-fullstack-project-navy.vercel.app/table-data/${id}`);
            showToast('success',res.data.message || "Deleted successful!")
            getMembersData()
        } catch (err) {
            showToast('error',err.response?.data?.message || "Deleted failed!")
        }
    };
    


    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <Typography variant="h5" fontWeight="bold">
                    Todo — Team Directory
                </Typography>
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, dept, location or id..."
                    variant="outlined"
                    size="small"
                />
                <div style={{
                    width: "40px", height: "40px", display: "flex", alignItems: "center",
                    justifyContent: "center", background: 'linear-gradient(to right, rgb(63, 81, 181), rgb(156, 39, 176))', border: "1px solid gray", borderRadius: "10px"
                }}>
                    <AddIcon style={{ float: "right", color: "whitesmoke" }} onClick={handleOpen} />
                </div>
            </div>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead style={{ background: "linear-gradient(to right, #3f51b5, #9c27b0)" }}>
                        <TableRow>
                            <TableCell style={{ color: "white", cursor: "pointer" }} onClick={() => toggleSort("id")}>Id</TableCell>
                            <TableCell style={{ color: "white", cursor: "pointer" }} onClick={() => toggleSort("name")}>Name</TableCell>
                            <TableCell style={{ color: "white", cursor: "pointer" }} onClick={() => toggleSort("department")}>Department</TableCell>
                            <TableCell style={{ color: "white", cursor: "pointer" }} onClick={() => toggleSort("location")}>Location</TableCell>
                             <TableCell style={{ color: "white", cursor: "pointer" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered?.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell>{row.id} </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.location}</TableCell>
                                 <TableCell> <EditIcon  color='primary' onClick={()=> handleUpdate(row)} /> <DeleteIcon style={{color:"red", paddingLeft:"50px"}} onClick={()=> deletuser(row.id)}/> </TableCell>

                            </TableRow>
                        ))}

                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
                Click a row to see quick details. Click column headers to sort.
            </Typography>

            <Modal open={open}onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                    }}
                    
                >
                    <Typography variant="h6" mb={2}>
                        Add New Member
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Department"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={ selectedId ? handleDataUpdate :  handleSubmit }
                        style={{ marginTop: 16 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
              <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}