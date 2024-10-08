const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

// 맛집 정보 api 호출
app.get('/restaurantInfo', function (req, res) {
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://busan-7beach.openapi.redtable.global/api/rstr?serviceKey=5Gvra5PoBdSV6niMIORj6z2oAFjHb7q6Pm07Uo1JgtjNbsjo8sZJ2AEgXvVSAH2e',
        'headers': {
        }
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.send(response.body);
    });
})

// 날씨 정보 api 호출
app.get('/weatherInfo', function (req, res) {
    var request = require('request');
    const beach_num = req.query.beach_num;
    const base_date = req.query.base_date;
    var url = 'http://apis.data.go.kr/1360000/BeachInfoservice/getVilageFcstBeach?serviceKey=vXwhGSVB6Yqoc%2BxflYJ8OXFy0OLMeREvOwmvDeT8cSCJqG3aYe0%2Bey0jJQA3itSLU4ufgjBO3oKcoDAxHLH6%2BQ%3D%3D&numOfRows=10000&dataType=JSON&base_date=' + base_date + '&base_time=1100' + '&beach_num=' + beach_num;

    var options = {
        'method': 'GET',
        'url': url,
        'headers': {
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.send(response.body);
    });
})





app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))