import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Movies.css";
import { NavLink } from "react-router-dom";

const Movies = () => {
    const [topMovie, setTopMovie] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchMovie = async (page) => {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            const response = await axios.get(
                'https://api.themoviedb.org/3/discover/movie',
                {
                    params: {
                        api_key: 'c9055af6a221621e7482dc780d75a5be',
                        page: randomPage,
                    },
                }
            );
            setTopMovie((prevAnime) => [...prevAnime, ...response.data.results]);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching  Movies :', error);
        }
    };

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= scrollHeight - 100) {
            if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1);
                fetchMovie(currentPage + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, totalPages]);

    useEffect(() => {
        fetchMovie(currentPage);
    }, []);

    return (
                <div className="favorites">
                    <h1>Movies</h1>
                    <div className="inside-favorites">
                        { topMovie.length > 0 && (
                            topMovie.map((movie, index) => (
                            <NavLink to={`/${movie.id}`}>
                                <div className="filmRec" key={movie.id}>
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt={movie.name} />
                                    <div className="filmInfo" style={{ display: "flex", justifyContent: "space-between" }}>
                                        <h5>{movie.title}</h5>
                                        <div className="inside-filmInfo">
                                            <span><i className="fa-solid fa-star"></i>{movie.vote_average}</span>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                            ))
                        )
                        }
                    </div>
                </div>
    );
};

export default Movies;
