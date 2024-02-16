import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return children ;
}

export default PrivateRoute;