import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import ChatWidget from "../widgets/ChatWidget";
import ChatListWidget from "../widgets/ChatListWidget";
import ChatWindow from "../chatWindow";

const HomePage = () => {
    const isNonMobile = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobile ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobile ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={picturePath} />
                </Box>
                <Box
                    flexBasis={isNonMobile ? "42%" : undefined}
                    mt={isNonMobile ? undefined : "2rem"}
                >
                    <MyPostWidget picturePath={picturePath} />
                    <PostsWidget userId={_id} />
                </Box>
                {isNonMobile && (
                    <Box flexBasis="26%">
                        <AdvertWidget />
                        <Box m="2rem 0" />
                    </Box>
                )}
            </Box>
            <ChatWindow />
        </Box>
    );
}

export default HomePage;