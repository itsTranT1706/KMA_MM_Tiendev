import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    Typography,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Pagination,
    TextField,
    MenuItem,
    Box,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icon quay lại
import { useNavigate } from 'react-router-dom';
import { getLogActivity } from "../../Api_controller/Service/adminService";


// Fetch dữ liệu logs


const mockLogs = [
    { id: 1, log: 'User admin logged in' },
    { id: 2, log: 'User user1 updated their account' },
    { id: 3, log: 'User admin created a new account' },
];

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredLogs, setFilteredLogs] = useState([]);

    const navigate = useNavigate(); // Hook điều hướng

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard'); // Điều hướng đến trang AdminDashboard
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await getLogActivity();
                if (response.status === 200) {
                    setLogs(response.data.data);
                    setFilteredLogs(response.data.data);
                    console.log(logs);
                } else {
                    console.error("Failed to fetch logs:", response.message);
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    const indexOfLastLog = currentPage * rowsPerPage;
    const indexOfFirstLog = indexOfLastLog - rowsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const handleLogUpdated = (updatedLog) => {
        //console.log("Updated user:", updatedUser);
        // Cập nhật danh sách người dùng mà không gọi lại API
        setLogs((prevLogs) =>
            prevLogs.map((log) =>
                log.id === updatedLog.id ? { ...log, ...updatedLog } : log
            )
        );
    };

    return (
        <Box sx={{ padding: 2 }}>
            {/* Icon Button back to Dashboard */}
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton
                    color="primary"
                    onClick={handleBackToDashboard}
                    sx={{ mr: 2 }} // Khoảng cách giữa icon và tiêu đề
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5">Activity Logs</Typography>
            </Box>

            {/* Danh sách hoạt động */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-blue-100 text-white">
                            <TableCell>id</TableCell>
                            <TableCell>actor_id</TableCell>
                            <TableCell>actor_role</TableCell>
                            <TableCell>action</TableCell>
                            <TableCell>endpoint</TableCell>
                            <TableCell>request_data</TableCell>
                            <TableCell>response_status</TableCell>
                            <TableCell>ip_address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.id}</TableCell>
                                <TableCell>{log.actor_id}</TableCell>
                                <TableCell>{log.actor_role}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.endpoint}</TableCell>
                                <TableCell>{JSON.stringify(log.request_data)}</TableCell>
                                <TableCell>{log.response_status}</TableCell>
                                <TableCell>{log.ip_address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={Math.ceil(filteredLogs.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
        </Box>
    );
};

export default ActivityLogs;
