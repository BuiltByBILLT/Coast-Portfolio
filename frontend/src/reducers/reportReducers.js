import {
    REPORT_AVERAGE_REQUEST,
    REPORT_AVERAGE_SUCCESS,
    REPORT_AVERAGE_FAIL,
    REPORT_LOWINV_REQUEST,
    REPORT_LOWINV_SUCCESS,
    REPORT_LOWINV_FAIL,
} from "../constants/reportConstants"


export const reportAverageReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case REPORT_AVERAGE_REQUEST:
            return { loading: true, }
        case REPORT_AVERAGE_SUCCESS:
            return { loading: false, dataAverage: action.payload }
        case REPORT_AVERAGE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const reportLowInvReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case REPORT_LOWINV_REQUEST:
            return { loading: true }
        case REPORT_LOWINV_SUCCESS:
            return { loading: false, dataLowInv: action.payload }
        case REPORT_LOWINV_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

