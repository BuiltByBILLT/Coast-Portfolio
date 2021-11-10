import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addWishListItem, removeWishListItem } from '../actions/userActions'


export const HeartList = ({ pID, size }) => {
    const { userInfo } = useSelector(state => state.userLogin)

    const dispatch = useDispatch()

    const addHandler = () => {
        dispatch(addWishListItem(pID))
    }
    const removeHandler = () => {
        // alert(pID)
        dispatch(removeWishListItem(pID))
    }

    return (
        <div>
            {userInfo
                ? userInfo.wishList.includes(pID)
                    ? <i className={`fas fa-heart fa-${size} text-danger`}
                        onClick={removeHandler}
                        style={{ cursor: "pointer" }}>
                    </i>

                    : <i className={`far fa-heart fa-${size} text-danger`}
                        onClick={addHandler}
                        style={{ cursor: "pointer" }}>
                    </i>
                : <Link to="/login">
                    <i className={`far fa-heart fa-${size} text-danger`}></i>
                </Link>
            }
        </div>
    )
}
