import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ...existing code...

const handleLogout = () => {
    // ...existing logout logic...
    toast.success('You have successfully logged out!');
};

// ...existing code...

export default Logout;
