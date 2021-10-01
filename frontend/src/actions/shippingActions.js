// import axios from 'axios'
// import {
//     ORDER_CREATE_REQUEST,
//     ORDER_CREATE_SUCCESS,
//     ORDER_CREATE_FAIL,
// } from '../constants/orderConstants'


// export const createUPS = (orderId) => async (dispatch, getState) => {
//     try {
//         // dispatch({ type: ORDER_DETAILS_REQUEST })

//         const { userLogin: { userInfo } } = getState()
//         const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

//         const { data } = await axios.post(`/api/shipping/ups`, {
//             orderId: orderId
//         }, config)

//         // dispatch({
//         //     type: ORDER_DETAILS_SUCCESS,
//         //     payload: data
//         // })
//         return data

//     } catch (error) {
//         // dispatch({
//         //     type: ORDER_DETAILS_FAIL,
//         //     payload: error.response && error.response.data.message
//         //         ? error.response.data.message : error.message
//         // })
//         return error
//     }
// }
