import { useContext } from 'react'
import { Redirect, Route } from 'react-router';
import { UserContext } from '../contexts/UserContext'

function StaffRoute({ component: Component, ...rest }) {
    const user = useContext(UserContext)


    return (
        <Route
            {...rest}
            render={(props) =>
                user._id
                    ? user.isStaff
                        ? <Component {...props} />
                        : <Redirect to={`/`} />
                    : <Redirect to={`/login?redirect=${props.history.location.pathname}`} />
            }
        />
    );
}

export default StaffRoute
