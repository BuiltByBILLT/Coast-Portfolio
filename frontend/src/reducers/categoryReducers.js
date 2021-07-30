import {
    CATEGORY_DETAILS_FAIL,
    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_RESET,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_PRODUCTS_FAIL,
    CATEGORY_PRODUCTS_REQUEST,
    CATEGORY_PRODUCTS_SUCCESS,
    CATEGORY_TOP_FAIL,
    CATEGORY_TOP_REQUEST,
    CATEGORY_TOP_SUCCESS,
} from "../constants/categoryConstants"


export const categoryDetailsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case CATEGORY_DETAILS_REQUEST:
            return { loading: true, }
        case CATEGORY_DETAILS_SUCCESS:
            return { loading: false, category: action.payload }
        case CATEGORY_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        case CATEGORY_DETAILS_RESET:
            return { category: { breadcrumbs: [], children: [] } }
        default:
            return state
    }
}

export const categoryProductsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case CATEGORY_PRODUCTS_REQUEST:
            return { loading: true }
        case CATEGORY_PRODUCTS_SUCCESS:
            return { loading: false, products: action.payload }
        case CATEGORY_PRODUCTS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const categoryTopReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case CATEGORY_TOP_REQUEST:
            return { loading: true }
        case CATEGORY_TOP_SUCCESS:
            return { loading: false, top: action.payload }
        case CATEGORY_TOP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

