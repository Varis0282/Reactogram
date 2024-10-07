import React, { useState } from "react";
import "./card.css";
import { API_BASE_URL } from "../config";
import axios from "axios";

const Card = (props) => {
  const [commentbox, setCommentbox] = useState(false);
  const [comment, setComment] = useState("");
  const userId = JSON.parse(localStorage.getItem("User")).id;

  const CONFIG_URL = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const [liked, setLiked] = useState(false);

  //get the ago time of post
  const getAgoTime = (postTime) => {
    const currentTime = new Date();
    const postDate = new Date(postTime);
    const diff = currentTime - postDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  };

  const agoTime = getAgoTime(props.postData.createdAt);
  console.log(agoTime);
  const likeDislikePost = async (postId, type) => {
    if (type === "like") {
      if (!liked) {
        const request = { postId: postId };
        const response = await axios.put(
          `/like/`,
          request,
          CONFIG_URL
        );
        if (response.status === 200) {
          setLiked(true);
          props.getAllPosts();
        }
      }
    }
    if (type === "dislike") {
      if (liked) {
        const request = { postId: postId };
        const response = await axios.put(
          `/unlike/`,
          request,
          CONFIG_URL
        );
        if (response.status === 200) {
          props.getAllPosts();
          setLiked(false);
        }
      }
    }
  };

  const submitComment = async (postId) => {
    const request = { postId: postId, commentText: comment };
    const response = await axios.put(
      `/comment/`,
      request,
      CONFIG_URL
    );
    if (response.status === 200) {
      setCommentbox(false);
      props.getAllPosts();
    }
  };
  return (
    <div>
      <div className="card shadow-sm">
        <div className="card-body px-2">
          <div className="row">
            <div className="col-6 d-flex">
              <img
                className="p-2 post-profile-pic"
                alt="profile pic"
                src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              />
              <div className="mt-2">
                <p className="fs-6 fw-bold">{props.postData.author.fullName}</p>
                <p className="location">{props.postData.location}</p>
              </div>
            </div>
            <div className="col-6">
              {props.postData.author._id === userId ? (
                <i
                  className="float-end fs-5 p-2 mt-2 fa-solid fa-trash"
                  onClick={() => props.deletePost(props.postData._id)}
                  style={{ cursor: "pointer" }}
                ></i>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <img
                style={{ borderRadius: "15px", maxHeight: "300px", minHeight: "300px", objectFit: "cover", width: "100%" }}
                className="p-2 img-fluid"
                alt="post pic"
                src={props.postData.image}
              />
              {
                props.postData.description ?
                  <div className="p-2">
                    {props.postData.description}
                  </div>
                  : ""
              }
            </div>
          </div>
          <div className="row my-3">
            <div className="col-6 d-flex">
              <i
                onClick={() => likeDislikePost(props.postData._id, "like")}
                className={`ps-2 fs-4 fa-regular ${liked ? "fa-heart text-danger" : "fa-heart"
                  }`}
              ></i>
              <i
                onClick={() => likeDislikePost(props.postData._id, "dislike")}
                className="ps-3 fs-4 fa-solid fa-heart-crack"
              ></i>
              <i
                onClick={() => setCommentbox(true)}
                className="ps-3 fs-4 fa-regular fa-comment"
              ></i>
            </div>
            <div className="col-6">
              <span className="pe-2 fs-6 fw-bold float-end">
                {props.postData.likes.length} likes
              </span>
            </div>
          </div>
          {commentbox ? (
            <div className="row mb-2">
              <div className="col-8">
                <textarea
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-warning"
                  onClick={() => submitComment(props.postData._id)}
                >
                  Comment
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          {props.postData.comments.map((comment) => {
            return (
              <div className="row">
                <div className="col-12">
                  <p>{comment.commentText} - <b>{comment.commentedBy.fullName}</b></p>
                </div>
              </div>
            );
          })}
          <div className="row">
            <div className="col-12">
              <span className="p-2 text-muted">{agoTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
