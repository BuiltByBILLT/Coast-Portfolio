import axios from 'axios'
import {
    CATEGORY_DETAILS_FAIL,
    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_PRODUCTS_FAIL,
    CATEGORY_PRODUCTS_REQUEST,
    CATEGORY_PRODUCTS_SUCCESS,
    CATEGORY_TOP_FAIL,
    CATEGORY_TOP_REQUEST,
    CATEGORY_TOP_SUCCESS
} from "../constants/categoryConstants"


export const getCategoryDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/categories/details/${id}`)

        dispatch({
            type: CATEGORY_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CATEGORY_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })

    }
}


export const getCategoryProducts = (id) => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_PRODUCTS_REQUEST })

        const { data } = await axios.get(`/api/categories/products/${id}`)

        dispatch({
            type: CATEGORY_PRODUCTS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CATEGORY_PRODUCTS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })

    }
}

export const getTopCategories = (id) => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_TOP_REQUEST })

        const { data } = await axios.get(`/api/categories/top`)

        dispatch({
            type: CATEGORY_TOP_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CATEGORY_TOP_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })

    }
}
