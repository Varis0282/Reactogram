import './App.css';
import { BrowserRouter , Routes , Route} from "react-router-dom";
import Login from './pages/Login'
import Signup from './pages/Signup';
import Navbar from './components/navbar'
import Postoverview from './pages/Postoverview';
import Profile from './pages/profile';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {

  function DynamicRouting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

      const userData = JSON.parse(localStorage.getItem("User"));
      if (userData) {//when user has a login active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
      }  //eslint-disable-next-line
    }, []); 

    return (
      <Routes>
        <Route exact path="/" element={<Postoverview />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/posts" element={<Postoverview />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
      </Routes>
    )
  }


  return (
    <div className='app-bg'>
      <BrowserRouter>
        <Navbar />
        <DynamicRouting />
      </BrowserRouter>
    </div>
  );
}

export default App;
