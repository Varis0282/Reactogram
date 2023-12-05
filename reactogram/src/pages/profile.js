import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import moreAction from "../images/horizontalMoreAction.PNG";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { API_BASE_URL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.userReducer);
  const [fileUploaded, setFileUploaded] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState({ preview: "", data: "" });
  const [show, setShow] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [details, setDetails] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showPost, setShowPost] = useState(false);

  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

  const CONFIG_URL = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const showDetail = (post) => {
    setDetails(post);
  };
  const getMyPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_URL);
    if (response.status === 200) {
      setMyPosts(response.data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };

  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
    setFileUploaded(true);
  };

  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);

    const response = axios.post(`${API_BASE_URL}/uploadFile`, formData);
    return response;
  };

  const addPost = async () => {
    if (image.preview === "") {
      Swal.fire({
        icon: "warning",
        title: "Upload image first",
      });
    } else if (caption === "") {
      Swal.fire({
        icon: "warning",
        title: "Upload caption first",
      });
    } else if (location === "") {
      Swal.fire({
        icon: "warning",
        title: "Upload location first",
      });
    } else {
      setLoading(true);
      const imgRes = await handleImgUpload();
      const request = {
        description: caption,
        location: location,
        image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
      };
      const postResponse = await axios.post(
        `${API_BASE_URL}/createPost`,
        request,
        CONFIG_URL
      );
      setLoading(false);
      if (postResponse.status === 201) {
        navigate("/posts");
      } else {
        Swal.fire({
          icon: "error",
          title: "Some error occured while uploading , Try again later",
        });
      }
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deletepost/${postId}`,
        CONFIG_URL
      );

      if (response.status === 200) {
        setShowPost(false);
        handleClose();
        getMyPosts();
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
    getMyPosts();
  }, []);
  return (
    <div className="container shadow mt-3 p-4">
      {/* Top Section */}
      <div className="row">
        <div className="col-md-6 d-flex flex-column">
          <img
            className="p-2 img-fluid profile-pic"
            alt="profile pic"
            src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          />
          <p className="ms-3 fs-5 fw-bold">{user.user.fullName}</p>
          <p className="ms-3 fs-5">{user.user.email}</p>
          <p className="ms-3 fs-5">
            Full Stack Developer{" "}
            <a href="varisrajak.me">
              <b>{user.user.fullName}</b>
            </a>{" "}
            || Follow{" "}
            <a href="varisrajak.me">
              <b>{user.user.fullName}</b>
            </a>
          </p>
          <p className="ms-3 fs-5">
            My link : <a href="varisrajak.me">{user.user.fullName}</a>
          </p>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between mt-3">
          <div className="d-flex justify-content-equal mx-auto fw-bold">
            <div className="count-section pe-4 pe-md-5 text-center">
              <h4>{myPosts.length}</h4>
              <p>Posts</p>
            </div>
            <div className="count-section px-4 px-md-5 text-center">
              <h4>20</h4>
              <p>Followers</p>
            </div>
            <div className="ps-md-5 ps-4 text-center">
              <h4>20</h4>
              <p>Following</p>
            </div>
          </div>
          <div className="mx-auto mt-md-0 mt-4">
            <button className="custom-btn shadow-sm custom-btn-white me-md-3">
              <span className="fs-6">Edit Profile</span>
            </button>
            <button
              className="custom-btn shadow-sm custom-btn-white"
              onClick={handlePostShow}
            >
              <span className="fs-6">Upload Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* HR section */}
      <div className="row my-3">
        <div className="col-12">
          <hr />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="row">
        {myPosts.map((post) => {
          return (
            <div className="col-md-4 col-4" key={post._id}>
              <div className="card" onClick={handleShow}>
                <img
                  onClick={() => showDetail(post)}
                  src={post.image}
                  className="post-pic card-img-top"
                  alt="flower"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div>
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    ></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        src={details.image}
                        className="d-block w-100"
                        alt="..."
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZsb3dlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                        className="d-block w-100"
                        alt="..."
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZsb3dlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                        className="d-block w-100"
                        alt="..."
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                {/* top section right side */}
                <div className="row">
                  <div className="col-6 d-flex">
                    <img
                      className="p-2 profile-pic"
                      alt="profile pic"
                      src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                    />
                    <div className="mt-2 m-2">
                      <p className="fs-6 fw-bold">{details.location}</p>
                      <p className="location">{details.description}</p>
                    </div>
                    <Dropdown drop="right" className="ms-5">
                      <Dropdown.Toggle variant="none" className="custom-toggle">
                        <img src={moreAction} alt="More Action" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                          <i className="fa-solid fa-pen-to-square me-1"></i>Edit
                          Post
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => deletePost(details._id)}>
                          <i className="fa-solid fa-trash-can me-1"></i>Delete
                          Post
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                {/* time section */}
                <div className="row">
                  <div className="col-12">
                    <span className="p-2 text-muted">2 hours ago</span>
                  </div>
                </div>
                {/* Post description section */}
                <div className="row mt-2">
                  <div className="col-12 ms-2">
                    <p>{details.description}</p>
                  </div>
                </div>
                {/* icons and likes section */}
                <div className="row my-3">
                  <div className="col-6 d-flex">
                    <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                    <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                    <i className="ps-3 fs-4 fa-regular fa-paper-plane"></i>
                  </div>
                  <div className="col-12 mt-2 ms-2">
                    <span className="fs-6 fw-bold">200 likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Upload Post Pop-up */}
      <Modal show={showPost} onHide={handlePostClose} size="xl" centered>
        <Modal.Header closeButton>
          <span className="fs-3 fw-bold">Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-12 ps-5 pt-3 pb-5 mb-4">
              {fileUploaded ? (
                // Display the uploaded file preview
                <img
                  alt="Preview"
                  src={image.preview}
                  height="400"
                  width="400"
                />
              ) : (
                // Display the file upload section
                <div className="dropZoneContainer upload-box d-flex flex-column justify-content-center align-items-center text-center">
                  <input
                    name="file"
                    type="file"
                    id="drop zone"
                    className="Fileupload"
                    accept=".jpg,.png,.gif"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="drop zone"
                    className="mb-0  upload-box d-flex flex-column justify-content-center align-items-center text-center"
                  >
                    <i
                      role="button"
                      className="fa-solid fa-cloud-arrow-up fs-2 text-center mb-2"
                    ></i>
                    <span role="button" className="fs-5">
                      Upload photo from your device
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="col-md-6 pe-5 pt-3 col-sm-12 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-sm-12">
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Add Caption"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Add Caption"
                      onChange={(ev) => {
                        setCaption(ev.target.value);
                      }}
                    />
                  </FloatingLabel>
                </div>
                <div className="col-sm-12">
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <>
                        <i className="fa-solid fa-location-dot pe-2"></i>
                        Add Location
                      </>
                    }
                    className="mb-3 text-box"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Add Location"
                      onChange={(ev) => {
                        setLocation(ev.target.value);
                      }}
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  {loading ? (
                    <div className="col-md-12 mt-3 text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    className="btn btn-danger shadow-sm float-end"
                    onClick={() => addPost()}
                  >
                    <span className="fs-6">Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
