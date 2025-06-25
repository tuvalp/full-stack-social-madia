import { BrowserRouter, Route, Routes } from "react-router-dom";
import Post from "../Posts/Posts";
import Profile from "../Profile/Profile";
import TopBar from "./TopBar";
import PostItem from "../Posts/PostItem";

export default function Main() {
  return (
    <>
        <BrowserRouter>
        <TopBar />

          <Routes>
            <Route path="*" element={<Post />} />
            <Route path="/" element={<Post />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/post/:id" element={<div className="scrollable-y"><PostItem /></div>} />
          </Routes>
        </BrowserRouter>
    </>
  );
}
