import axios from '../../axios'

export const fetchCountries = () => axios.get("https://api.covid19api.com/countries")

export const fetchDataCOVID = (id) => axios.get(`https://api.covid19api.com/dayone/country/${id}`)