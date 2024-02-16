import React , { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TopMovies from "../topMovies/TopMovies"
import "./discovery.css" ;
import ContinueWatching from "../continueWatching/ContinueWatching" ;
import { NavLink } from "react-router-dom";
import { AuthContext } from '../../context/Auth';
import { db } from "../../config/firebase";
import { collection, query, where, getDocs , deleteDoc , addDoc } from 'firebase/firestore';



function Discovery() {

    const [ data , setData ] = useState([])
    const [info, setInfo] = useState([]);
    const [ isFav, setIsFav ] = useState(false);
    const { user } = useContext(AuthContext);

    const apiKey = 'c9055af6a221621e7482dc780d75a5be';

    
    const favoritesCollectionRef = collection( db , "favorites" ) ;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const tvShows = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`);                
                const randomIndex = Math.floor(Math.random() * tvShows.data.results.length);
                const randomTvShow = tvShows.data.results[randomIndex];
                setData([randomTvShow]);
            } catch (err) {
                console.log(err);
            }
        };
    
        fetchAll();
    }, []);
    

    useEffect(() => {
        const fetchGenres = async () => {
        const info = await Promise.all(data.slice(0, 1).map((film) => fetchGenreById(film.id)));
            setInfo(info);
        };

        fetchGenres();
    }, [data]);

    const fetchGenreById = async (id) => {
        try {
            const detail = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
            const genreNames = (detail.data.genres.map((item) => item.name)).join(" - ");
            const seasonNumber = detail.data.number_of_seasons;
            const episodes = detail.data.number_of_episodes;
            const newInfo = [ { genreNames , seasonNumber , episodes } ] 
            return newInfo ; ;
        } catch (err) {
            console.log(err);
            return '';
        }
    };


    const addToFavorites = async (userId, showTvId) => {
        try {
            const querySnapshot = await getDocs(query(favoritesCollectionRef, where('userId', '==', userId), where('tvShowId', '==', showTvId)));
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                setIsFav(false);
                console.log('Removed from favorites successfully');
            } else {
                await addDoc(favoritesCollectionRef, {
                    userId: userId,
                    tvShowId: showTvId,
                });
                setIsFav(true);
                console.log('Added to favorites successfully');
            }
        } catch (error) {
            console.error('Error adding/removing from favorites:', error);
        }
    };

    const addToComments = async (userId, showTvId) => {
        try {
            const querySnapshot = await getDocs(query(favoritesCollectionRef, where('userId', '==', userId), where('tvShowId', '==', showTvId)));
            if (!querySnapshot.empty) {
                console.log('This combination already exists in favorites.');
                return;
            }
    
            await addDoc(favoritesCollectionRef, {
                userId: userId,
                tvShowId: showTvId,
            });
            setIsFav(true);
            console.log('Added to favorites successfully');
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };
    

    console.log( isFav ) ;

    return (
        <div className="discovery">
            <div className="top">
                {data.length > 0 && data[0] && data[0].name && info[0]&& (
                    <div className="image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${data[0].backdrop_path})` }}>
                        <div className="content">
                                <>
                                    <p>{ "Series" }</p>
                                    <h2>{ data[0].name }</h2>
                                    <p>{ info[0][0].seasonNumber } Season - { info[0][0].episodes } Episodes - { info[0][0].genreNames }</p>
                                    <div className='button'>
                                        <button><NavLink to={`/${data[0].id}`}><i className="fa-solid fa-caret-right"></i>Watch Trailer</NavLink></button>
                                        <a href="#" onClick={() => addToFavorites(user.uid, data[0].id)}>
                                            {
                                                !isFav ? 
                                                <i className="fa-regular fa-heart"></i>
                                                : 
                                                <i class="fa-solid fa-heart fav"></i>
                                            }
                                            add to Favorites
                                        </a>                                    
                                    </div>
                                </>
                        </div>
                    </div>
                )}

                <div className="channels">
                    <img src="/images/disnep.jpg" alt="disnep" />
                    <img src="/images/National-Geographic-logo.jpg" alt="National-Geographic-logo" />
                    <img src="/images/starWars.png" alt="starWars" />
                    <img src="/images/marvelLogo.jpg" alt="marvelLogo" />
                </div>
                <ContinueWatching />
            </div>
            <TopMovies />
        </div>
    )
}

export default Discovery