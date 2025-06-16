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


const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const rowsPerPage = 8;

    const navigate = useNavigate(); // Hook điều hướng

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard'); // Điều hướng đến trang AdminDashboard
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await getLogActivity(currentPage);
                if (response.status === 200) {
                    setLogs(response.data.data);
                    setFilteredLogs(response.data.data);
                    console.log("check", logs);
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

    const convertUTCToVietnamTime = (utcDateString) => {
        const utcDate = new Date(utcDateString);
        return utcDate.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    // const vietnamTime = convertUTCToVietnamTime(utcTime);

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
                            <TableCell>STT</TableCell>
                            <TableCell>username</TableCell>
                            <TableCell>role</TableCell>
                            <TableCell>action</TableCell>
                            <TableCell>endpoint</TableCell>
                            <TableCell>request_data</TableCell>
                            <TableCell>response_status</TableCell>
                            {/* <TableCell>ip_address</TableCell> */}
                            <TableCell>Vào hồi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentLogs.map((log, index) => (
                            <TableRow key={log.ID}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{log.Username}</TableCell>
                                <TableCell>{log.Role}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.endpoint}</TableCell>
                                <TableCell>{JSON.stringify(log.request_data)}</TableCell>
                                <TableCell>{log.response_status}</TableCell>
                                <TableCell>{convertUTCToVietnamTime(log.created_at)}</TableCell>
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
