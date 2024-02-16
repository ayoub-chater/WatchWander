import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Serie.css";
import { NavLink } from "react-router-dom";


const Serie = () => {
    const [topSerie, setTopSerie] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchSerie = async (page) => {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            const response = await axios.get(
                'https://api.themoviedb.org/3/discover/tv',
                {
                    params: {
                        api_key: 'c9055af6a221621e7482dc780d75a5be',
                        page: randomPage,
                    },
                }
            );
            setTopSerie((prevAnime) => [...prevAnime, ...response.data.results]);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching  Series :', error);
        }
    };

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= scrollHeight - 100) {
            if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1);
                fetchSerie(currentPage + 1);
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
        fetchSerie(currentPage);
    }, []);

    return (
    <div className="favorites">
        <h1>Series</h1>
        <div className="inside-favorites">
            { topSerie.length > 0 && (
                topSerie.map((serie, index) => (
                <NavLink to={`/${serie.id}`}>
                    <div className="filmRec" key={serie.id}>
                        <img src={`https://image.tmdb.org/t/p/original/${serie.backdrop_path}`} alt={serie.name} />
                        <div className="filmInfo" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h5>{serie.name}</h5>
                            <div className="inside-filmInfo">
                                <span><i className="fa-solid fa-star"></i>{serie.vote_average}</span>
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

export default Serie;
