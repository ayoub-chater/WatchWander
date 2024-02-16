import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./anime.css" ;
import { NavLink } from "react-router-dom";

const Anime = () => {
    const [topAnime, setTopAnime] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTopAnimationTVShows = async (page) => {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            const response = await axios.get(
                'https://api.themoviedb.org/3/discover/tv',
                {
                    params: {
                        api_key: 'c9055af6a221621e7482dc780d75a5be',
                        with_genres: '16,10759,10765',
                        page: randomPage,
                    },
                }
            );
            setTopAnime((prevAnime) => [...prevAnime, ...response.data.results]);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching top animation TV shows:', error);
        }
    };

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= scrollHeight - 100) {
            if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1);
                fetchTopAnimationTVShows(currentPage + 1);
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
        fetchTopAnimationTVShows(currentPage);
    }, []);

    return (
            <div className="favorites">
                <h1>Animes</h1>
                <div className="inside-favorites">
                    { topAnime.length > 0 && (
                        topAnime.map((anime, index) => (
                        <NavLink to={`/${anime.id}`}>
                            <div className="filmRec" key={anime.id}>
                                <img src={`https://image.tmdb.org/t/p/original/${anime.backdrop_path}`} alt={anime.name} />
                                <div className="filmInfo" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h5>{anime.name}</h5>
                                    <div className="inside-filmInfo">
                                        <span><i className="fa-solid fa-star"></i>{anime.vote_average}</span>
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

export default Anime;
