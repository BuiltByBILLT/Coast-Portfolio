import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UserContext } from '../contexts/UserContext'

export default function useClover() {

    const user = useContext(UserContext)

    const { isLoading, data, refetch } = useQuery('clovers', () => {
        return axios.get(`/api/inventory/cloverids`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        cacheTime: Infinity,
        staleTime: Infinity
    })

    return data?.data;
}
