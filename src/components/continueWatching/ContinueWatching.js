import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './continueWatching.css';
import { db } from "../../config/firebase";
import { AuthContext } from '../../context/Auth';
import { collection, query, where, getDocs , deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';


function ContinueWatching() {
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);

    const apiKey = 'c9055af6a221621e7482dc780d75a5be';
    const episodesCollectionRef = collection(db, "progress");
    const userId = user.uid;

    const fetchData = async () => {
        try {
            const sql = query(episodesCollectionRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(sql);
    
            const episodesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                serieId: doc.data().serieId,
                seasonNumber: doc.data().seasonNumber,
                episodeNumber: doc.data().episodeNumber
            }));
    
            console.log(episodesData); 
    
            
            const episodesDetailsPromises = episodesData.map(async episode => {
                const { serieId, seasonNumber, episodeNumber } = episode;
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}`);
                return { ...response.data, serieId }; 
            });
    
            const episodesDetails = await Promise.all(episodesDetailsPromises);
            console.log(episodesDetails);
            setData(episodesDetails);
        } catch (err) {
            console.log(err);
        }
    };
    
    
    

    
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    console.log( data )

    return (
        <div className="continueWatching">
            <h2>Continue Watching</h2>
            <Slider {...settings}>
    {data.map((item, index) => {
        return (
            <React.Fragment key={index}>
                
                <a href={`/${item.serieId}`}>
                    
                    <Link to={`/${item.serieId}`} className="slide" style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original/${item.still_path}")` }}>
                        
                    </Link>
                </a>
            </React.Fragment>
        );
    })}
</Slider>
        </div>
    );
    
}

export default ContinueWatching;
