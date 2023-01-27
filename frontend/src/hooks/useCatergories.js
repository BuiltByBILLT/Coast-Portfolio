import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UserContext } from '../contexts/UserContext'

export default function useCategories() {

    const user = useContext(UserContext)

    const { isLoading, data, refetch } = useQuery('categories', () => {
        return axios.get(`/api/categories`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        cacheTime: Infinity,
        staleTime: Infinity
    })

    return data?.data;
}
