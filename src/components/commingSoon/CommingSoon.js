import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './commingSoon.css';
import { NavLink } from "react-router-dom";

const API_KEY = 'c9055af6a221621e7482dc780d75a5be';

const CommingSoon = () => {
  const [upcomingShows, setUpcomingShows] = useState([]);

  useEffect(() => {
    const fetchUpcomingShows = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&region=US&language=en-US&page=2`);
        setUpcomingShows(response.data.results);
      } catch (error) {
        console.error('Error fetching upcoming shows:', error);
      }
    };

    fetchUpcomingShows();
  }, []);

  return (
        <div className="favorites">
        <h1>Comming Soon</h1>
        <div className="inside-favorites">
            { upcomingShows.length > 0 && (
                upcomingShows.map((serie, index) => (
                <NavLink to={`/${serie.id}`}>
                    <div className="filmRec" key={serie.id}>
                        <img src={`https://image.tmdb.org/t/p/original/${serie.backdrop_path}`} alt={serie.name} />
                        <div className="filmInfo" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h5>{serie.title}</h5>
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


export default CommingSoon;
