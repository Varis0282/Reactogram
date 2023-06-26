import React, { useEffect, useState } from "react";
import Card from "../components/card";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";

const Postoverview = () => {
  const CONFIG_URL = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const [allPosts, setAllPosts] = useState([]);

  const getAllPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/allposts`);
    if (response.status === 200) {
      setAllPosts(response.data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deletepost/${postId}`,
        CONFIG_URL
      );

      if (response.status === 200) {
        getAllPosts();
      } else {
        Swal.fire({
          icon: "error",
          title: response.data.error,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="container mt-md-5 mt-3">
      <div className="row">
        {allPosts.map((posts) => {
          return (
            <div className="col-md-4 mb-2" key={posts._id}>
              <Card postData={posts} deletePost={deletePost} getAllPosts={getAllPosts} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postoverview;
