import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import './topRated.css';
import { NavLink } from "react-router-dom";


const API_KEY = 'c9055af6a221621e7482dc780d75a5be';



const TopRated = () => {
  const [topRatedShows, setTopRatedShows] = useState([]);
  const location = useLocation();
  const { category } = useParams();
  const { genre_ids } = useParams();

  console.log(category);

  useEffect(() => {
    const fetchTopRatedShows = async () => {
      try {
        const type = category === 'movies' ? 'movie' : 'tv';

        const randomPage = Math.floor(Math.random() * 10) + 1;

        let genres = '';

        const response = await axios.get(`https://api.themoviedb.org/3/${type}/top_rated`, {
          params: {
            api_key: 'c9055af6a221621e7482dc780d75a5be',
            page: randomPage,
          },
        });

        const firstGenreId = response.data.results[0]?.genre_ids[0];

        const isFirstGenreAnimation = firstGenreId === 16;

        console.log('Is first genre animation?', isFirstGenreAnimation);

        if (category === 'series') {
          genres = isFirstGenreAnimation ? '' : '80,18,10759,10761,9648'; // These are genre IDs for series excluding animation
        } else if (category === 'movies') {
          genres = ''; // These are genre IDs for movies
        } else if (category === 'animes') {
          genres = isFirstGenreAnimation ? '16,1,2,4,8,9,10,14,7,20,22,24,36,37,41' : ''; // These are genre IDs for anime
        }

        // Fetch the data again with the updated genres
        const updatedResponse = await axios.get(`https://api.themoviedb.org/3/${type}/top_rated`, {
          params: {
            api_key: 'c9055af6a221621e7482dc780d75a5be',
            with_genres: genres,
            page: randomPage,
          },
        });

        setTopRatedShows(updatedResponse.data.results);
      } catch (error) {
        console.error('Error fetching top-rated shows:', error);
      }
    };

    fetchTopRatedShows();
  }, [category]);

  return (
    <div className="favorites">
    <h1>Top Rated {category === 'movies' ? 'Movie' : 'Tv'}</h1>
    <div className="inside-favorites">
        { topRatedShows.length > 0 && (
            topRatedShows.map((serie, index) => (
            <NavLink to={`/${serie.id}`}>
                <div className="filmRec" key={serie.id}>
                    <img src={`https://image.tmdb.org/t/p/original/${serie.backdrop_path}`} alt={serie.name} />
                    <div className="filmInfo" style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5>{ category === 'movies' ? serie.title : serie.name }</h5>
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

const getLaunchYear = (dateString) => {
  const year = new Date(dateString).getFullYear();
  return year || 'N/A';
};

export default TopRated;
