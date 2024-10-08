//DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
$(document).ready(function () {
    const travelInfoStr = localStorage.getItem('travelInfo');
    const travelInfo = JSON.parse(travelInfoStr);
    $('#selected-beach').text(`선택한 해수욕장: ${travelInfo.beach}`);
    travelBeach = travelInfo.beach;
    selectedDate = travelInfo.date;
    selectedTime = travelInfo.time;
    $('#selected-date').text(`선택한 날짜: ${travelInfo.date}`);
    const time = travelInfo.time;
    const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`;
    $('#selected-time').text(`선택한 시간: ${formattedTime}`);
    getMapInfo();
    printWeather(travelInfo.beach, travelInfo.data);
});

var travelBeach, selectedDate, selectedTime;
//입력 format 오류, 네트워크 연결 오류 등의 예외 처리 기능 구현
function getMapInfo() {
    $.get("http://localhost:3000/restaurantInfo", function (data, status) {
        if (status === "success") {
            // 식당의 정보를 파싱해서 저장
            var parsed = JSON.parse(data);
            var positions = [];
            if (parsed.body) {
                parsed.body.forEach((item, index) => {
                    positions.push({
                        title: item.RSTR_NM,
                        latlng: new kakao.maps.LatLng(item.RSTR_LA, item.RSTR_LO),
                        streetAdress: item.RSTR_RDNMADR,
                        address: item.RSTR_LNNO_ADRES,
                        phoneNumber: item.RSTR_TELNO,
                        foodType: item.BSNS_STATM_BZCND_NM,
                        restuarantType: item.BSNS_LCNC_NM,
                        introduce: item.RSTR_INTRCN_CONT,
                        id: item.RSTR_ID
                    });
                });
                // 저장된 식당들과 정보들을 카카오맵에 띄워주는 함수 호출
                printMap(positions);
                //입력 format 오류, 네트워크 연결 오류 등의 예외 처리 기능 구현
            } else {
                console.error("Unexpected response format:", parsed);
            }
        } else {
            console.error("Failed to fetch data");
        }
    });
}

// 날짜 format 맞춰주는 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function printWeather(beach, date) {
    var tomorrow = new Date();
    var today = new Date();
    var base_date = new Date();
    selectedDate = formatDate(new Date(selectedDate));
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = formatDate(tomorrow);

    today = formatDate(today);

    base_date.setDate(base_date.getDate() - 1);
    base_date = formatDate(base_date);

    var beach_num = getBeachNum(beach);
    //DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
    // 날씨 정보 api를 호출하여 받은 정보를 띄워줌
    if (selectedDate < today || selectedDate > tomorrow) {
        $('#weather').text("최근 1일 간의 날씨만 제공합니다");
    } else {
        $.get("http://localhost:3000/weatherInfo", { beach_num: beach_num, base_date: base_date }, function (data, status) {
            if (status === "success") {
                var weatherData = JSON.parse(data);
                var filteredItems = weatherData.response.body.items.item.filter(item => item.fcstDate === selectedDate && item.fcstTime === selectedTime);
                if (filteredItems.length > 0) {
                    var weatherText = filteredItems.map(item => {
                        var valueWithUnit = item.fcstValue;
                        var txt = "";
                        if (item.category == "TMP") {
                            txt = "날씨 정보";
                            valueWithUnit += "℃";
                        } else if (item.category == "UUU") {
                            txt = "동서바람성분";
                            valueWithUnit += "m/s";
                        } else if (item.category == "VVV") {
                            txt = "남북바람성분";
                            valueWithUnit += "m/s";
                        } else if (item.category == "VEC") {
                            txt = "풍향";
                            valueWithUnit += "deg";
                        } else if (item.category == "WSD") {
                            txt = "풍속";
                            valueWithUnit += "m/s";
                        } else if (item.category == "SKY") {
                            txt = "하늘상태";
                            valueWithUnit = getSkyStatus(item.fcstValue);
                        } else if (item.category == "PTY") {
                            txt = "강수형태";
                            valueWithUnit = getPrecipitation(item.fcstValue);
                        } else if (item.category == "POP") {
                            txt = "강수확률";
                            valueWithUnit += "%";
                        } else if (item.category == "WAV") {
                            txt = "파고";
                            valueWithUnit += "M";
                        } else if (item.category == "PCP") {
                            txt = "1시간 강수량";
                        } else if (item.category == "REH") {
                            txt = "습도";
                            valueWithUnit += "%";
                        } else if (item.category == "SNO") {
                            txt = "1시간 신적설";
                        }

                        return `<p>${txt}: ${valueWithUnit}</p>`;
                    }).join(' ');
                    //DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
                    $('#weather').html(`${weatherText}</p>`);
                    //입력 format 오류, 네트워크 연결 오류 등의 예외 처리 기능 구현
                } else {
                    $('#weather').text("해당 날짜와 시간에 대한 날씨 정보가 없습니다.");
                }
            } else {
                $('#weather').text("날씨 정보를 가져오는 데 실패했습니다.");
            }
        });
    }
}

function getPrecipitation(value) {
    switch (value) {
        case "0":
            return "없음";
        case "1":
            return "비";
        case "2":
            return "비/눈";
        case "3":
            return "눈";
        case "4":
            return "소나기";
    }
}

function getSkyStatus(value) {
    switch (value) {
        case "1":
            return "맑음";
        case "3":
            return "구름많음";
        case "4":
            return "흐림";
        default:
            return "null";
    }
}

function getBeachNum(beach) {
    switch (beach) {
        case "광안리":
            return 306;
        case "해운대":
            return 304;
        case "다대포":
            return 308;
        case "송도":
            return 268;
        case "송정":
            return 305;
        case "일광":
            return 309;
        case "임랑":
            return 307;
    }
}

// 저장된 식당들과 정보들을 카카오맵에 띄워줌
function printMap(positions) {
    var mapContainer = document.getElementById('map');
    var centerCoord;

    switch (travelBeach) {
        case "광안리":
            centerCoord = new kakao.maps.LatLng(35.153168043300546, 129.1189759877557);
            break;
        case "해운대":
            centerCoord = new kakao.maps.LatLng(35.158698, 129.160384);
            break;
        case "송도":
            centerCoord = new kakao.maps.LatLng(35.07593103210778, 129.01695345912947);
            break;
        case "다대포":
            centerCoord = new kakao.maps.LatLng(35.045530, 128.967839);
            break;
        case "송정":
            centerCoord = new kakao.maps.LatLng(35.1785498571425, 129.1997619852681);
            break;
        case "임랑":
            centerCoord = new kakao.maps.LatLng(35.318983043375745, 129.2640514325163);
            break;
        case "일광":
            centerCoord = new kakao.maps.LatLng(35.25987620349495, 129.23370369411532);
            break;
        default:
            centerCoord = new kakao.maps.LatLng(35.158698, 129.160384);
    }

    var mapOption = {
        center: centerCoord, // 위에서 설정한 중심좌표
        level: 3 // 지도의 확대 레벨
    };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (let i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지 
        });

        var infowindow = new kakao.maps.InfoWindow({
            content: positions[i].title // 인포윈도우에 표시할 내용
        });

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다 
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        //DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        kakao.maps.event.addListener(marker, 'click', function () {
            document.getElementsByClassName('restuarantName')[0].innerText = "[ " + positions[i].title + " ]";
            document.getElementsByClassName('streetAdress')[0].innerText = "도로명 주소: " + positions[i].streetAdress;
            document.getElementsByClassName('address')[0].innerText = "지번 주소: " + positions[i].address;
            document.getElementsByClassName('phoneNumber')[0].innerText = "전화번호: " + positions[i].phoneNumber;
            document.getElementsByClassName('foodType')[0].innerText = "영업신고증업태명: " + positions[i].foodType;
            document.getElementsByClassName('restuarantType')[0].innerText = "영업인허가명: " + positions[i].restuarantType;
            document.getElementsByClassName('introduce')[0].innerText = "소개: " + positions[i].introduce;
        });
    }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

