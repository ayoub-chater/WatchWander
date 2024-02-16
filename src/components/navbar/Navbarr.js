import "./navbar.css";
import { useState, useEffect } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbarr() {
    const [toggle, setToggle] = useState(true);
    const [show, setShow] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (searchQuery.trim() === "") {
                    setResults([]);
                    return;
                }

                const apiKey = "c9055af6a221621e7482dc780d75a5be";

                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/multi?query=${searchQuery}&api_key=${apiKey}`
                );

                const resultsWithGenres = await Promise.all(
                    response.data.results.map(async (result) => {
                        const resultDetails = await axios.get(
                            `https://api.themoviedb.org/3/${result.media_type}/${result.id}?api_key=${apiKey}`
                        );
                        return {
                            ...result,
                            genres: resultDetails.data.genres.map((genre) => genre.name),
                        };
                    })
                );

                setResults(resultsWithGenres);
            } catch (error) {
                console.error("Error fetching results:", error.message);
            }
        };

        fetchResults();
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setShow(false);
    };

    const handleClick = () => {
        setToggle(!toggle);
        setShow(true);
        setSearchQuery("") ;
    };

    return (
        <div className="Navbar">
            <Navbar expand="lg">
                <Container fluid>
                    <Navbar.Brand>
                        <NavLink to="/">AH-ISMAGI</NavLink>
                    </Navbar.Brand>
                    <div className="search">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <NavLink href="#link">
                            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                        </NavLink>
                    </div>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <ul className="me-0 navbar-nav">
                            <div className="lwest1">
                                <NavLink to="/movies">Movies</NavLink>
                                <NavLink to="/series">Series</NavLink>
                                <NavLink to="/animes">Animes</NavLink>
                            </div>
                            <div className="lwest2">
                                <a className="lwest2-serach">
                                    <div
                                        className={`inputContainer ${toggle ? "" : "isToggle"}`}
                                    >
                                        <input
                                            type="text"
                                            name="search"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            className="inputSearch"
                                        />
                                        <i
                                            onClick={handleClick}
                                            className="fa-sharp fa-solid fa-magnifying-glass"
                                        ></i>
                                    </div>
                                </a>
                                <NavLink to="/ContactUs">
                                    <Button variant="primary">Subscribe</Button>
                                </NavLink>
                                <NavLink to="/search" className="notif">
                                    <i className="fa-regular fa-bell"></i>
                                    <span>3</span>
                                </NavLink>
                                <NavLink to="/search" className="profile">
                                    <img src="images/profile.jpg" alt="Profile" />
                                    <i className="fa-solid fa-chevron-down"></i>
                                </NavLink>
                            </div>
                        </ul>
                    </Navbar.Collapse>
                </Container>
                {!show && results.length > 0 && (
                    <div className={`search-show ${show ? "" : "visible"}`}>
                        <ul className="search-show-ul">
                            {results.map((result) => (
                                    <NavLink to={`/${result.id}`} style={{ textDecoration: "none" }} onClick={ handleClick }>
                                <li className="show" key={result.id}>
                                        {result.poster_path && (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185${result.poster_path}`}
                                                alt={`${result.title || result.name} Poster`}
                                            />
                                        )}
                                        <div className="info">
                                            <h5>{result.title || result.name}</h5>
                                            <div className="info-right">
                                                {result.media_type === "movie" ? <p>Movie . </p> : <p>TV Show . </p>}
                                                <p>{result.genres.join(", ")} . </p>
                                                <p><i className="fa-solid fa-star"></i>{result.vote_average}</p>
                                            </div>
                                        </div>
                                </li>
                                    </NavLink>
                            ))}
                        </ul>
                    </div>
                )}
            </Navbar>
        </div>
    );
}

export default Navbarr;
