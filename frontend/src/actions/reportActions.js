import axios from 'axios'
import {
    REPORT_AVERAGE_REQUEST,
    REPORT_AVERAGE_SUCCESS,
    REPORT_AVERAGE_FAIL,
    REPORT_LOWINV_REQUEST,
    REPORT_LOWINV_SUCCESS,
    REPORT_LOWINV_FAIL,
} from "../constants/reportConstants"


export const getAverage = (start, end) => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_AVERAGE_REQUEST })

        const { userLogin: { userInfo } } = getState()
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.get(`/api/reports/average?start=${start}&end=${end}`, config)

        dispatch({
            type: REPORT_AVERAGE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: REPORT_AVERAGE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })
    }
}

export const getLowInv = () => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_LOWINV_REQUEST })

        const { userLogin: { userInfo } } = getState()
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.get(`/api/reports/low`, config)

        dispatch({
            type: REPORT_LOWINV_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: REPORT_LOWINV_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })
    }
}



