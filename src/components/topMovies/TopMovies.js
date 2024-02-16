import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './topMovies.css';
import { NavLink } from "react-router-dom" ;

function TopMovies() {
    const [data, setData] = useState([]);
    const [genreNames, setGenreNames] = useState([]);

    const apiKey = 'c9055af6a221621e7482dc780d75a5be';

    useEffect(() => {
        const fetchAll = async () => {
        try {
            const topMovies = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
            setData(topMovies.data.results);
        } catch (err) {
            console.log(err);
        }
        };

        fetchAll();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
        const genres = await Promise.all(data.slice(0, 3).map((film) => fetchGenreById(film.id)));
            setGenreNames({ genres });
        };

        fetchGenres();
    }, [data]);

    const fetchGenreById = async (id) => {
        try {
        const detail = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const genreNames = detail.data.genres.map((item) => item.name);
        return genreNames.join(' - ');
        } catch (err) {
        console.log(err);
        return '';
        }
    };

    return (
        <div className="topMovies">
            <h3>Top Movies</h3>
            {data.map((film, index) => {
                if (index < 3) {
                    return (
                        <NavLink to={`/${film.id}`} key={film.id} style={{ textDecoration : "none" }}>
                            <div className="film">
                                <img src={`https://image.tmdb.org/t/p/w185/${film.poster_path}`} alt={film.title} />
                                <div className="filmInfo">
                                    <p>{film.original_language === "en" ? "English" : film.original_language}</p>
                                    <h5>{film.title}</h5>
                                    <p><i className="fa-solid fa-film"></i> {genreNames.genres[index]}</p>
                                    <span><i className="fa-solid fa-star"></i>{film.vote_average}</span>
                                </div>
                            </div>
                        </NavLink>
                    );
                } else {
                    return null;
                }
            })}
            <button>See All</button>
            <h3>Favorites Genres</h3>
        </div>
    );
}

export default TopMovies;







