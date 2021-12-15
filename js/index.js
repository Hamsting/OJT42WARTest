function WIP() {
    ohSoSorryItsWorkingInProgress();
}

function ohSoSorryItsWorkingInProgress() {
    alert("현재 준비 중입니다.");
}


var equipItemCon;
var noticeItemCon;
var equips;
var selectedEquip;

$("document").ready(function() {
    equipItemCon = document.getElementById("equipContainer");
    noticeItemCon = document.getElementById("noticeContainer");
    requestEquips();
    requestNotices();
    
    $('#darken-background').click(function () {
        hideLightBox();
    });
    $('#lightbox').click(function (event) {
        event.stopPropagation()
    });

    $("#makeDraft").click(function() {
        makeDraft(selectedEquip);
    });
});



function requestEquips() {
	/*
    var data = {};
    data = JSON.stringify(data);    

    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:8000/reqEquips");
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', function(){
        equips = JSON.parse(xhr.responseText);
        renderEquips();
    });
	*/
	equips =
	{
		"list": [
			{"id": 1, "category": "전산", "type": "노트북", "name": "Dell 에일리언웨어 17", "code": "MR-01", "desc": "VR 가능, 엄청난 사양.", "count": 2, "img": "1.jpg"},
			{"id": 2, "category": "전산", "type": "PC", "name": "그래픽 작업용 PC", "code": "PC-0073", "desc": "대단한 사양.", "count": 1, "img": "2.jpg"},
			{"id": 3, "category": "전산", "type": "모니터", "name": "32인치 와이드 모니터", "code": "MN-0002", "desc": "21:9 와이드 모니터.", "count": 4, "img": "3.jpg"},
			{"id": 4, "category": "전산", "type": "모니터", "name": "24인치 모니터", "code": "MN-0014", "desc": "16:9 일반 모니터.", "count": 5, "img": "4.jpg"},
			{"id": 5, "category": "전산", "type": "마우스", "name": "로지텍 G102", "code": "MOUSE-0002", "desc": "컴퓨터 마우스.", "count": 0, "img": "5.jpg"},
			{"id": 6, "category": "전산", "type": "키보드", "name": "일반 키보드", "code": "KEY-0001", "desc": "컴퓨터 키보드.", "count": 1, "img": "6.jpg"}
		]
	};
    renderEquips();
}

function renderEquips() {
    equips.list.forEach(function (itemJson) {
        addNewEquipItem(itemJson);
    });
}

function addNewEquipItem(itemJson) {
    var t = document.querySelector('#equipItem');
    var clone = document.importNode(t.content, true);
    var imgSrc = "./res/equipimg/" + itemJson.img;

    clone.querySelector("#equipName").textContent = itemJson.name;
    clone.querySelector("#equipDesc").textContent = itemJson.desc;
    clone.querySelector("#equipImg").src = imgSrc;

    $(clone).find("a").each(function (index, item) {
        item.onclick = function() {
            selectedEquip = itemJson;
            updateContent(imgSrc, itemJson);
            showLightBox();
        }
    });

    equipItemCon.appendChild(clone);
}



function requestNotices() {
    var data = {};
    data = JSON.stringify(data);    

    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:8000/reqNotices");
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', function(){
        notices = JSON.parse(xhr.responseText);
        renderNotices();
    });
}

function renderNotices() {
    notices.list.forEach(function (itemJson) {
        addNewNoticeItem(itemJson);
    });
}

function addNewNoticeItem(itemJson) {
    var t;
    if (itemJson.level == "warning")
        t = document.querySelector('#noticeItem-warning');
    else
        t = document.querySelector('#noticeItem-info');
    var clone = document.importNode(t.content, true);
    clone.querySelector("#noticeText").textContent = itemJson.content;
    
    noticeItemCon.appendChild(clone);
}


function showLightBox() {
    $('#darken-background').show();
    $('body').css('overflow', 'hidden');
}

function updateContent(imgSrc, equipJson) {
    $('#lightbox-content').attr('src', imgSrc);
    $('#lightboxEquipName').text(equipJson.name);
    $('#lightboxEquipDesc').text(equipJson.desc);
    $('#lightboxEquipType').text(equipJson.category + "/" + equipJson.type);
    $('#lightboxEquipCode').text(equipJson.code);
    $('#lightboxEquipCount').text(equipJson.count);

    if (equipJson.count > 0)
    {
        $('#makeDraft').text("기안 작성하기");
        $('#makeDraft').attr("disabled", false);
    }
    else
    {
        $('#makeDraft').text("재고 없음");
        $('#makeDraft').attr("disabled", true);
    }

}

function hideLightBox() {
    $('#darken-background').hide();
    $('body').css('overflow', '');
}

function makeDraft(equipJson) {
    window.open('http://localhost:8000/makeDraft?' + htmlUtils.jsonToQS(equipJson));
}



var htmlUtils = {
    encodeURI : function(contents, encoding) {
        var encoding = typeof encoding == 'undefined' || encoding == "" ? "UTF-8" : encoding;
        return encodeURIComponent(contents, encoding);
    },
    encodingCheck : function(contents) {
        var regCheck = /^[A-Za-z0-9]$/;
        return regCheck.test(contents);
    },
    tempQS : "",
    jsonToQS : function(param) {
        htmlUtils.tempQS = "";
        jsonToQSTemp(param);
        return htmlUtils.tempQS;
    }
}

function jsonToQSTemp(param, keyString) {
    if (typeof param == "object") {
        if (Array.isArray(param)) {
            for (var i = 0; i < param.length; i++) {
                if (typeof param[i] == "object") {
                    jsonToQSTemp(param[i], keyString + "[" + i + "]");
                }
                else {
                    if (typeof keyString != 'undefined' && keyString != "") {
                        jsonToQSTemp(param[i], keyString + "[" + i + "]");
                    }
                }
            }
        }
        else {
            for (var key in param) {
                if (typeof param[key] == "object") {
                    if (Array.isArray(param[key])) {
                        jsonToQSTemp(param[key], key);	
                    }
                    else {
                        jsonToQSTemp(param[key]);	
                    }
                }
                else {
                    if (typeof keyString != 'undefined' && keyString != "") {
                        jsonToQSTemp(param[key], keyString + "." + key);
                    }
                    else {
                        jsonToQSTemp(param[key], key);
                    }
                }
            }
        }
    }
    else {
        if (htmlUtils.tempQS != "") {
            htmlUtils.tempQS += "&"
        }
        if (!htmlUtils.encodingCheck(param)) {
            param = htmlUtils.encodeURI(param);
        }
        htmlUtils.tempQS += keyString + "=" + param;
    }
}