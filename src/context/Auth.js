import { createContext , useEffect, useState } from "react" ; 
import { auth } from "../config/firebase" ; 

export const AuthContext = createContext() ;

export const AuthProvider = ( { children } ) => {
    const [ user , setUser ] = useState(null) ;
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
    
        return unsubscribe ;
    }, [ user ]);

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={ { user } } >{ children }</AuthContext.Provider>
    )
}

