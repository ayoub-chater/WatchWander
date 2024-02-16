import { NavLink , useLocation } from 'react-router-dom';
import "./sidebar.css" ;
import { auth , logOut } from "../../config/firebase" ; 


function SideBar() {

    const location = useLocation() ;
    let category = location.pathname.split('/')[1] || 'series';

    return (
        <div className="sidebar">
            <div className="all">
                <div className="top">
                    <h3>MENU</h3>
                    <ul>
                        <li><NavLink to="/"><i class="fa-brands fa-discourse"></i>Discovery</NavLink></li>
                        <li><NavLink to={`/${category}/topRated`}><i class="fa-regular fa-star"></i>Top Rated</NavLink></li>
                        <li><NavLink to="/commingSoon"><i class="fa-regular fa-clock"></i>Comming Soon</NavLink></li>
                    </ul>
                </div>
                <div className="bottom">
                    <h3>LIBRARY</h3>
                    <ul>
                        <li><NavLink to="/recentPlayed"><i class="fa-regular fa-clock"></i>Recent Played</NavLink></li>
                        <li><NavLink to="/favorites"><i class="fa-regular fa-star"></i>Favorites</NavLink></li>
                        <li><NavLink><i class="fa-solid fa-moon"></i>Dark Mode</NavLink></li>
                        <li><NavLink to="/settings"><i class="fa-solid fa-gear"></i>Settings</NavLink></li>
                    </ul>
                </div>
            </div>
            <div class="logout">
                <button onClick={ () => logOut(auth) }><i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out</button>
            </div>
        </div>
    );
}

export default SideBar;
