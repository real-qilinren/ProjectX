import {
    Box, Typography,
    useMediaQuery,

} from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../navbar';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import ChatWidget from "../widgets/ChatWidget";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const token = useSelector(state => state.token);
    const isNonMobile = useMediaQuery("(min-width:1000px)");

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobile ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobile ? "26%" : undefined}>
                    <UserWidget userId={userId} picturePath={user.picturePath} />
                    <Box m="2rem 0" />
                </Box>
                <Box
                    flexBasis={isNonMobile ? "54%" : undefined}
                    mt={isNonMobile ? undefined : "2rem"}
                >
                    <Box m="2rem 0" />
                    <PostsWidget userId={userId} isProfile />
                </Box>
                {/*<ChatWidget />*/}
            </Box>
        </Box>
    );
}

export default ProfilePage;