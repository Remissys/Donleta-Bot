const { default: axios } = require("axios");


async function getDayPerformance(day=null) {
    let data = []

    const response = await axios.get('/runs/daily/', {
        baseURL: process.env.DONLETA_URL,
        params: {
            day
        }
    })

    if (response.data.data) {
        data = response.data.data
    }

    return data    
}

module.exports = getDayPerformance