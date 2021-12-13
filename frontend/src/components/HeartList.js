import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { addWishListItem, removeWishListItem } from '../actions/userActions'
import { useLocation } from 'react-router'
import { UserContext, UserContextUpdate } from '../contexts/UserContext'
import { useMutation } from 'react-query'
import axios from 'axios'

export const HeartList = ({ pID, size }) => {
    const { pathname } = useLocation()
    const user = useContext(UserContext)
    const updateUser = useContext(UserContextUpdate)


    const { mutate, isLoading, reset } = useMutation((type) => {
        if (type === "ADD") {
            return axios.put(`/api/users/wish/${pID}`, "", {
                headers: { Authorization: `Bearer ${user.token}` }
            })
        }
        if (type === "DELETE") {
            return axios.delete(`/api/users/wish/${pID}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
        }
    }, {
        onSuccess: (data) => {
            console.log(data && data.data)
            updateUser({ type: "UPDATE", payload: data.data.userData })
        },
        onError: (error) => {
            console.log(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    const addHandler = () => {
        mutate("ADD")
    }
    const removeHandler = () => {
        mutate("DELETE")
    }

    return (
        <div>
            {user._id
                ? user.wishList.includes(pID)
                    ? <i className={`fas fa-heart fa-${size} text-danger`}
                        onClick={removeHandler}
                        style={{ cursor: "pointer" }}>
                    </i>

                    : <i className={`far fa-heart fa-${size} text-danger`}
                        onClick={addHandler}
                        style={{ cursor: "pointer" }}>
                    </i>
                : <LinkContainer to={"/login?redirect=" + pathname} style={{ cursor: "pointer" }} >
                    <i className={`far fa-heart fa-${size} text-danger`}></i>
                </LinkContainer>
            }
        </div >
    )
}
