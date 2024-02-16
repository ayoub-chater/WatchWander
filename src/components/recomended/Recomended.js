import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './recomended.css';
import { NavLink } from "react-router-dom";


function TopMovies({ id }) {
    const [data, setData] = useState([]);
    const [genreNames, setGenreNames] = useState([]);

    const apiKey = 'c9055af6a221621e7482dc780d75a5be';

    useEffect(() => {
        const fetchAll = async () => {
        try {
            const topMovies = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}`);
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
        <div className="recomended">
            <h3>Recommended</h3>
            {data.map((film, index) => {
                if (index < 3) {
                    return (
                        <NavLink to={`/${film.id}`} key={film.id} style={{ textDecoration: "none" }}>
                            <div className="filmRec">
                                <img src={`https://image.tmdb.org/t/p/original/${film.backdrop_path}`} alt={film.title} />
                                <div className="filmInfo">
                                    <h5>{film.name}</h5>
                                    <div className="inside-filmInfo">
                                        <p><i className="fa-solid fa-film"></i> {genreNames.genres[index]}</p>
                                        <span><i className="fa-solid fa-star"></i>{film.vote_average}</span>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    );
                } else {
                    return null;
                }
            })}
            <button>See All</button>
        </div>
    );
}

export default TopMovies;







