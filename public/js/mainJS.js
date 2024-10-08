//DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
$(document).ready(function () {
    $("#sel1").change(function () {
        var loc = "./img/" + $("#sel1").val() + ".png";
        $("#img1").attr("src", loc);
        $("#img1").show();
    });
});

// 입력한 값들의 정보를 BeachInfo.html로 넘겨줌
function passValue() {
    var beach = document.getElementById('sel1').value;
    var date = document.getElementById('date-select').value;
    var timeElements = document.getElementsByName('time');
    var time;

    for (var i = 0; i < timeElements.length; i++) {
        if (timeElements[i].checked) {
            time = timeElements[i].value;
            break;
        }
    }

    if (beach && date && time) {
        var travelInfo = {
            beach: beach,
            date: date,
            time: time
        };

        localStorage.setItem("travelInfo", JSON.stringify(travelInfo));
        location.href = "BeachInfo.html";
    } else {
        //입력 format 오류, 네트워크 연결 오류 등의 예외 처리 기능 구현
        alert("해수욕장, 날짜 및 시간을 모두 선택하세요.");
    }
}
