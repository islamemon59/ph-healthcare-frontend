import { httpClient } from "../lib/axios/httpClient"

const getDoctors = async () => {
    const doctors = await httpClient.get('/doctors')
    console.log(doctors)
    return doctors
}

export { getDoctors 
}