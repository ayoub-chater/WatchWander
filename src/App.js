import Navbarr from "./components/navbar/Navbarr";
import SideBar from "./components/sideBar/SideBar";
import { BrowserRouter , Routes , Route  } from 'react-router-dom';
import Anime from './components/animes/Anime';
import CommingSoon from './components/commingSoon/CommingSoon.js';
import Watch from './components/watch/Watch';
import Favorite from './components/favorites/Favorite';
import Settings from './components/settings/Settings';
import TopRated from './components/topRated/TopRated';
import Movie from './components/movies/Movie';
import Serie from './components/series/Serie';
import { useContext } from "react" ;
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import NotFound from "./components/NotFound";
import PrivateRoute from "./context/PrivateRoute";

import "./App.css" ;
import Discovery from './components/discovery/Discovery';

import { AuthContext } from '../src/context/Auth';




function App() {

    const { user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            {user ? (
                <PrivateRoute>
                <Navbarr />
                <SideBar />
                </PrivateRoute>
            ) : (
                ""
            )}
            <Routes>
                <Route path="/movies" element={<PrivateRoute><Movie /></PrivateRoute>} />
                <Route path="/:id" element={<PrivateRoute><Watch /></PrivateRoute>} />
                <Route path='/animes' element={<PrivateRoute><Anime /></PrivateRoute>} />
                <Route path='/movies' element={<PrivateRoute><Movie /></PrivateRoute>} />
                <Route path='/series' element={<PrivateRoute><Serie /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Discovery /></PrivateRoute>} />
                {/* <Route path="/topRated" element={<PrivateRoute><Serie /></PrivateRoute>} /> */}
                <Route path="/:category?/topRated" element={<PrivateRoute><TopRated /></PrivateRoute>} />
                <Route path="/favorites" element={<PrivateRoute><Favorite /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path='/commingSoon' element={<PrivateRoute><CommingSoon /></PrivateRoute>} />

                <Route path='/login' element={<LogIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>    
    </BrowserRouter>
    );
}

export default App;
