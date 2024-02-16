import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import './favorite.css';
import { db } from "../../config/firebase";
import { AuthContext } from '../../context/Auth';
import { collection, query, where, getDocs , deleteDoc } from 'firebase/firestore';


function Favorite({ id }) {
    const [series, setSeries] = useState([]);
    const { user } = useContext(AuthContext);

    const apiKey = 'c9055af6a221621e7482dc780d75a5be';
    const favoritesCollectionRef = collection(db, "favorites");
    const userId = user.uid;

    const fetchData = async () => {
        try {
            const sql = query(favoritesCollectionRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(sql);
            const favoriteSeriesIds = querySnapshot.docs.map((doc) => doc.data().tvShowId);

            const seriesDataPromises = favoriteSeriesIds.map(async (seriesId) => {
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`);
                return response.data;
            });

            const seriesData = await Promise.all(seriesDataPromises);
            setSeries(seriesData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, favoritesCollectionRef, apiKey]);

    const deleteFromFavorite = async (userId, showId) => {
        try {
            const querySnapshot = await getDocs(query(favoritesCollectionRef, where('userId', '==', userId), where('tvShowId', '==', showId)));
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            fetchData(); 
        } catch (error) {
            console.error('Error deleting from favorites:', error.message);
        }
    };

    return (
        <div className="favorites">
            <h1>Favorites</h1>
            <div className="inside-favorites">
                { series.length > 0 && (
                    series.map((seriesData, index) => (
                    <NavLink to={`/${seriesData.id}`}>
                        <div className="filmRec" key={seriesData.id}>
                            <img src={`https://image.tmdb.org/t/p/original/${seriesData.backdrop_path}`} alt={seriesData.title} />
                            <div className="filmInfo">
                                <h5>{seriesData.name}</h5>
                                <div className="inside-filmInfo">
                                    <span><i className="fa-solid fa-star"></i>{seriesData.vote_average}</span>
                                    <button onClick={ () => { deleteFromFavorite(userId, seriesData.id) } }>Delete</button>
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
}

export default Favorite;
