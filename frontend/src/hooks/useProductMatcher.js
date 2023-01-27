import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UserContext } from '../contexts/UserContext'

export default function useProductMatcher() {

    const user = useContext(UserContext)

    const { data: soloData } = useQuery('matcherSolo', () => {
        return axios.get(`/api/matcher/solo`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        cacheTime: Infinity,
        staleTime: Infinity
    })

    const { data: parentData } = useQuery('matcherParent', () => {
        return axios.get(`/api/matcher/parent`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        cacheTime: Infinity,
        staleTime: Infinity
    })

    return { soloData, parentData }
}
