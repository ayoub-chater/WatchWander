import React, { useState, useEffect , useContext, useCallback } from 'react';
import axios from 'axios';
import Recomended from '../recomended/Recomended';
import { useParams } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './watch.css';
import { AuthContext } from '../../context/Auth';
import { db } from "../../config/firebase";
import { collection, query, where, getDocs , addDoc , doc , serverTimestamp, onSnapshot } from 'firebase/firestore';

function Watch() {
    const [data, setData] = useState([]);
    const [cast, setCast] = useState([]);
    const [trailer, setTrailers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [progressEpisodes, setProgressEpisodes] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const { id } = useParams();
    const apiKey = 'c9055af6a221621e7482dc780d75a5be';
    const { user } = useContext(AuthContext);

    const progressCollectionRef = collection(db, "progress");

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
                );
                setData(response.data);
            } catch (error) {
                console.error('Error fetching movie data:', error.message);
            }
        };

        const fetchCast = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`
                );
                setCast(response.data);
            } catch (error) {
                console.error('Error fetching cast data:', error.message);
            }
        };

        const fetchTrailers = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}`
                );
                setTrailers(response.data.results);
            } catch (error) {
                console.error('Error fetching trailers:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        fetchCast();
        fetchTrailers();
        handleSeasonClick(1);
        fetchProgressEpisodes();
        fetchComments();

    }, [id, apiKey]);

    const fetchProgressEpisodes = async () => {
        try {
            const querySnapshot = await getDocs(
                query(progressCollectionRef, where("userId", "==", user.uid), where("serieId", "==", id))
            );
            const episodes = querySnapshot.docs.map(doc => doc.data());
            setProgressEpisodes(episodes);
        } catch (error) {
            console.error('Error fetching progress episodes:', error.message);
        }
    };

    const handleSeasonClick = async (seasonNumber) => {
        setSelectedSeason(seasonNumber);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apiKey}`
            );
            setEpisodes(response.data.episodes);
        } catch (error) {
            console.error('Error fetching trailers:', error.message);
        }
    };

    const addToProgress = async (userId, showTvId, seasonNumber , episodeNumber) => {
        try {
            const episodeRef = query(progressCollectionRef, where("userId", "==", userId), where("serieId", "==", showTvId), where("seasonNumber", "==", seasonNumber), where("episodeNumber", "==", episodeNumber));
            const querySnapshot = await getDocs(episodeRef);
            if (querySnapshot.empty) {
                await addDoc(progressCollectionRef, {
                    userId: userId,
                    serieId: showTvId,
                    seasonNumber: seasonNumber,
                    episodeNumber: episodeNumber,
                });
                console.log('Added to progress successfully');
            }
        } catch (error) {
            console.error('Error adding from progress:', error);
        }
        fetchProgressEpisodes();
    };

    const isEpisodeInProgress = (seasonNumber, episodeNumber) => {
        return progressEpisodes.some( (episode) => episode.seasonNumber === seasonNumber && episode.episodeNumber === episodeNumber);
    };


    const fetchComments = useCallback(() => {
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, where('tvId', '==', id));

        const unsubscribe = onSnapshot(commentsQuery, async (querySnapshot) => {
            const commentsData = await Promise.all(querySnapshot.docs.map(async (commentDoc) => {
                const commentData = commentDoc.data();
                const commentId = commentDoc.id;

                const repliesRef = collection(commentDoc.ref, 'replies');
                const repliesQuerySnapshot = await getDocs(repliesRef);

                const repliesData = repliesQuerySnapshot.docs.map(replyDoc => ({
                    id: replyDoc.id,
                    ...replyDoc.data(),
                }));

                return {
                    id: commentId,
                    ...commentData,
                    replies: repliesData,
                };
            }));

            setComments(commentsData);
        });

        return unsubscribe;
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') {
            alert('Please enter a comment.');
            return;
        }

        try {
            const commentsRef = collection(db, 'comments');
            await addDoc(commentsRef, {
                tvId: id,
                userId: user.uid,
                userEmail: user.email,
                comntContent: newComment,
                timestamp: serverTimestamp(),
            });

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment to Firestore:', error.message);
        }
    };

    const handleReplySubmit = async (e, parentCommentId, commentId) => {
        e.preventDefault();
        if (replyText.trim() === '') {
            alert('Please enter a reply.');
            return;
        }

        try {
            const commentRef = doc(db, 'comments', parentCommentId);
            const repliesRef = collection(commentRef, 'replies');

            await addDoc(repliesRef, {
                userId: user.uid,
                userEmail: user.email,
                replyContent: replyText,
                timestamp: serverTimestamp(),
                parentCommentId: commentId,
            });

            fetchComments();

            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error adding reply to Firestore:', error.message);
        }
    };

    const handleCommentReplyClick = (parentCommentId, replyCommentId) => {
        setReplyingTo({ parentCommentId, replyCommentId });
    };

    const getEmailUsername = (email) => {
        return email.split('@')[0];
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="discovery">
            <div className="top">
                {trailer && trailer.length > 0 && (
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${trailer[0].key}`}
                        title={trailer[0].name}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}
                { data && cast.cast && (
                    <div className="film-info">
                        <div className="infos">
                            <h3>{data.name}</h3>
                            <div className="actions">
                                <button className="button-share"><i className="fa-solid fa-share-nodes"></i>Share</button>
                                <button className="button-like"><i className="fa-solid fa-thumbs-up"></i>Like</button>
                            </div>
                        </div>
                        <p>
                            <i className="fa-solid fa-film"></i>
                            {data.genres.map((item) => item.name).join(' - ')}
                        </p>
                        <span>
                            <i className="fa-solid fa-star"></i>
                            {data.vote_average}
                        </span>
                        <h4>Story Line</h4>
                        <p>{data.overview}</p>
                        <h3>Top Actors</h3>
                        <div className="acteurs">
                            {cast.cast.map((actor, index) => {
                                if (index < 5) {
                                    return (
                                        <div className="acteur" key={index}>
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185/${actor.profile_path}`}
                                                alt=""
                                            />
                                            <div className="info-acteur">
                                                <h6>{actor.name}</h6>
                                                <p>The One of them</p>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        <div className='comments'>
                            <h3>Comments</h3>
                            <ul>
                                {comments.map((comment) => (
                                    <li key={comment.id} >
                                        <strong>{getEmailUsername(comment.userEmail)}</strong>
                                        <br />
                                        <div className='comment'>
                                            <strong>{comment.comntContent}</strong>
                                            <button onClick={() => handleCommentReplyClick(comment.id, null)}>
                                                {/* Reply */}
                                                <i className="fa fa-reply" aria-hidden="true" style={{ color: "black" }}></i>
                                            </button>
                                        </div>
                                        {replyingTo && replyingTo.parentCommentId === comment.id && (
                                            <form onSubmit={(e) => handleReplySubmit(e, comment.id, replyingTo.replyCommentId)}>
                                                <textarea
                                                    placeholder="Write a reply..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                />
                                                <button type="submit">Add Reply</button>
                                            </form>
                                        )}
                                        <ul>
                                            {comment.replies.map((reply) => (
                                                <li key={reply.id}>
                                                        <p style={{ fontWeight: "bold" , color: "white" , marginTop: "15px" }}>{getEmailUsername(reply.userEmail)}</p>
                                                    <div className="comment">
                                                    <div className="reply">
                                                        <strong>Reply:</strong> {reply.replyContent}
                                                    </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{ color: 'black' }}
                                />
                                <button type="submit">Add Comment</button>
                            </form>
                        </div>
                    </div>
                    )}
                    <h3 className='epp'>Seasons</h3>
                    <Slider {...settings}>
                        {Array.from({ length: data.number_of_seasons }, (_, i) => (
                            <NavLink className="season" to="" key={i} onClick={() => handleSeasonClick(i + 1)}>
                                { i + 1 }
                            </NavLink>
                        ))}
                    </Slider>
                    {
                        episodes && (
                            <NavLink className="episodes" style={{ textDecoration: "none" }}>
                                {
                                episodes.map( ( episode , index ) => {
                                    const isInProgress = isEpisodeInProgress(selectedSeason, index + 1);
                                    return (
                                            <div className="filmRec ep" onClick={ () => { addToProgress( user.uid , id , selectedSeason , index + 1 ) } }>
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original/${episode.still_path}`}
                                                    alt={episode.name}
                                                    style={{ border: isInProgress ? "5px solid #c13a4c" : "none" }}
                                                />
                                                <div className="filmInfo">
                                                    <div className="inside-filmInfo" style={{ display: "flex" , justifyContent: "space-between" }}>
                                                        <h6 className='h6'>{episode.name}</h6>
                                                        <span><i className="fa-solid fa-star"></i>{episode.vote_average}</span>
                                                        <h6>Episode : {index + 1}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                    )
                                } )
                                }
                            </NavLink>
                        )
                    }
            </div>
            <Recomended id = { id } />
        </div>
    );
}

export default Watch;
