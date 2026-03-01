const { default: axios } = require("axios")

async function getMonthPerformance(edition=null) {
    let data = []
    
    const response = await axios.get('/runs/monthly/', {
        baseURL: process.env.DONLETA_URL,
        params: {
            edition
        }
    })

    if (response.data.data) {
        data = response.data.data
    }

    return data
}

module.exports = getMonthPerformance