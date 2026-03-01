const { default: axios } = require("axios");

async function getWeekPerformance(week=null, edition=null) {
    let data = []

    const response = await axios.get('/runs/weekly/', {
        baseURL: process.env.DONLETA_URL,
        params: {
            week,
            edition
        }
    })

    if (response.data.data) {
        data = response.data.data
    }

    return data    
}

module.exports = getWeekPerformance