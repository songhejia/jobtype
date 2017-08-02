
var isedit = false;
// ------------------------------------------- 以下部分为职位部分-------------------------------------------
//定义一些变量
var $tagRank = $('#tag-rank');
var $boxJob = $('#boxJob');
var $itList = $('#boxJob .it-list');
var $otherList = $('#boxJob .other-list');
var $tagList = $('#boxJob .tag-list');
var $itListThree = $('#boxJob .it-list .it-list-three');
var $tagShow = $('#tag-show');
var MaxChooseTag = 5

if (!labelCacheBean.otherCategoryL1List)
    labelCacheBean.otherCategoryL1List = []

var position = {
    chooseLevel1: labelCacheBean.itCategoryL1List[0],        //被选择的一级选项
    chooseLevel2: labelCacheBean.itCategoryL1List[0].categoryL2s[0],        //被选择的二级选项
    chooseLevel3: labelCacheBean.itCategoryL1List[0].categoryL2s[0].categoryL3s[0],        //被选择的三级选项
    chooseLevel1Other: labelCacheBean.otherCategoryL1List ? labelCacheBean.otherCategoryL1List[0] : [],   //被选择的一级选项other
    rankLables: "",            //存被选择的职级标签
    sign: "it",             //标记选择是it还是other
    flag: false,             //标记确定被点击过与否
    level1Num: 0,            //标记it一级当前被选中的位置
    level2Num: 0,             //标记it二级当前被选中的位置
    level1OtherNum: 0,        //标记other一级当前被选中的位置
    chooseTags: []           //选中的标签
};
//已经存的数据
var saveDatas = {
    chooseTags: [],
    choosePositions: null,
    chooseLevel1: "",                //被选择的一级
    chooseLevel2: "",                //被选择的二级
    chooseLevel1Other: "",           //被选择的一级other
    level1Num: "",                   //标记it一级当前展示的位置
    level2Num: "",                   //标记it二级当前展示的位置
    level1OtherNum: "",              //标记other一级当前展示的位置
    rankLables: ""                    //存被选择的职级标签
};
//已经存的style
var chooseStyle = "";

//当前展示的数据
var currShow = {
    chooseLevel1: "",                //被选择的一级
    chooseLevel2: "",                //被选择的二级
    chooseLevel1Other: "",           //被选择的一级other
    level1Num: "",                      //标记it一级当前展示的位置
    level2Num: "",                      //标记it二级当前展示的位置
    level1OtherNum: "",                 //标记other一级当前展示的位置
    rankLables: "",                  //存被选择的职级标签
    itChooseAgain: false,
    otherChooseAgain: false
}

var abandonedLabels = []; // 记录已删除的标签，用于过滤从后端拉取的数据

//clear:3,4,
function clearData2() {
    position.chooseTags = [];
}
function clearData1() {
    currShow.chooseLevel1 = "";
    currShow.chooseLevel2 = "";
    currShow.chooseLevel1Other = "";
    currShow.level1Num = "";
    currShow.level2Num = "";
    currShow.level1OtherNum = "";
}


//点击显示职位列表
$("#boxJobInput").click(function () {
    if ($('#boxJob').is(":hidden")) {
        if (!isedit) {
            var height = $('body').scrollTop();
            $('#boxJob').show().attr("tabindex", -1).focus();
            $('body').scrollTop(height);
            $("#boxJobInput").css('borderColor', '#00b38a');
            if (saveDatas.choosePositions == null) {
                position.sign = "it";
            } else {
                position.sign = chooseStyle;
            }
            renderChange();
            rewriteData();
        }
    } else {
        $('#boxJob').hide();
        $("#boxJobInput").css('borderColor', '#d5dadf');
        if (saveDatas.choosePositions == null) {
            position.sign = "it";
            $("#boxJobInput span").text('请选择职位类别');
        } else {
            $("#boxJobInput span").text(saveDatas.choosePositions);
        }
    }
});


//回写数据
function rewriteData() {
    if (saveDatas.choosePositions != null && chooseStyle == position.sign) {
        position.chooseTags = saveDatas.chooseTags.map(function (item) {
            return $.extend({}, item);
        }); // 深复制
        position.rankLables = saveDatas.rankLables;
        if (chooseStyle == "it") {
            position.chooseLevel1 = saveDatas.chooseLevel1;
            position.chooseLevel2 = saveDatas.chooseLevel2;
            position.chooseLevel3 = saveDatas.chooseLevel3;
            position.level1Num = saveDatas.level1Num;
            position.level2Num = saveDatas.level2Num;
            position.level3Num = saveDatas.level2Num;
        } else {
            position.chooseLevel1Other = saveDatas.chooseLevel1Other;
            position.level1OtherNum = saveDatas.level1OtherNum;
        }
    }
}

function renderChange() {
    if (position.sign == "it") {
        //it的类别下有选择的情况
        if (saveDatas.choosePositions != null && chooseStyle == position.sign) {
            renderLevel1(saveDatas.level1Num, "");
            renderItLevel2(saveDatas.chooseLevel1, saveDatas.level2Num);
            renderItLevel3(saveDatas.chooseLevel2, saveDatas.level3Num);
            renderLevel3(saveDatas.chooseLevel3, saveDatas.rankLables, saveDatas);
            renderChooseLevel(saveDatas);
            $tagList.show();
            $itListThree.show();
            $boxJob.css('width', '838px');
        } else {
            position.chooseLevel1 = labelCacheBean.itCategoryL1List[0];
            position.chooseLevel2 = labelCacheBean.itCategoryL1List[0].categoryL2s[0];
            position.chooseLevel3 = labelCacheBean.itCategoryL1List[0].categoryL2s[0].categoryL3s[0];
            position.level1Num = 0;
            position.level2Num = 0;
            currShow.chooseLevel1 = "";
            currShow.chooseLevel2 = "";
            renderLevel1(0, "");
            renderItLevel2(labelCacheBean.itCategoryL1List[0], 0);
            // renderItLevel3(labelCacheBean.itCategoryL1List[0].categoryL2s[0], 0);
            $tagList.hide();
            $boxJob.css('width', '318px');
        }
        $itList.show();
        $otherList.hide();
        $('#it-list2').show();
    } else {
        if (saveDatas.choosePositions != null && chooseStyle == position.sign) {
            renderLevel1("", saveDatas.level1OtherNum);
            renderLevel3(saveDatas.chooseLevel1Other, saveDatas.rankLables, saveDatas);
            renderChooseLevel(saveDatas);
        } else {
            position.chooseLevel1Other = labelCacheBean.otherCategoryL1List[0];
            position.level1OtherNum = 0;
            currShow.chooseLevel1Other = "";
            renderLevel1("", 0);
            renderLevel3(labelCacheBean.otherCategoryL1List[0], labelCacheBean.otherCategoryL1List[0].rankLables, position);
        }
        $boxJob.css('width', '570px');

        $itList.hide();
        $otherList.show();
        $tagList.show();
    }
    $('.tag-bottom .tag-bottom-left').hide();
}

//点击外面，隐藏职位列表
$(document).mouseup(function (e) {
    var _con = $('#boxJob');   // 设置目标区域
    var _tar = $('#boxJobInput');
    if (!_tar.is(e.target) && _tar.has(e.target).length === 0 && !_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
        if ($('#boxJob').is(':visible')) {
            $(this).removeAttr("tabindex");
            $('#boxJob').hide();
            $("#boxJobInput").css('borderColor', '#d5dadf');
            if (saveDatas.choosePositions == null) {
                position.sign = "it";
                $("#boxJobInput span").text('请选择职位类别');
            } else {
                $("#boxJobInput span").text(saveDatas.choosePositions);
                position.sign = chooseStyle;
                clearData1();
            }
            //clearData2();
        }
    }
});

/*it一级渲染＋other一级渲染*/
function renderLevel1(indexIt, indexOther) {
    /*it一级渲染*/
    if (indexIt || indexIt == 0) {
        var itCategoryL1List = labelCacheBean.itCategoryL1List;
        var html = "",
            otherHtml = "";
        for (var i = 0; i < itCategoryL1List.length; i++) {
            var levelName = itCategoryL1List[i].name;
            html += '<li class="box-L1List-item" data-belong="it" data-num=' + i + '>'
                + '<span>' + levelName + '</span>'
                + '<i class="icon-arrow-right list-arrow"></i>'
                + '</li>';
        }
        $('#it-list1').html(html);
        //颜色标示出被选中的选项
        for (var i = 0; i < $('#it-list1 li').length; i++) {
            var num = parseInt($($('#it-list1 li')[i]).attr('data-num'), 10);
            if (num == indexIt) {
                $($('#it-list1 li')[i]).addClass('selected');
            } else {
                $($('#it-list1 li')[i]).removeClass('selected');
            }
        }
    }


    /*other一级渲染*/
    if (indexOther || indexOther == 0) {
        var otherCategoryL1List = labelCacheBean.otherCategoryL1List;
        var otherHtml = "";
        for (var i = 0; i < otherCategoryL1List.length; i++) {
            var otherLevelName = otherCategoryL1List[i].name;
            otherHtml += '<li class="box-L1List-item" data-belong="other" data-num=' + i + '>'
                + '<span>' + otherLevelName + '</span>'
                + '<i class="icon-arrow-right list-arrow"></i>'
                + '</li>';
        }
        $('#other-list1').html(otherHtml);
        //颜色标示出被选中的选项
        for (var i = 0; i < $('#other-list1 li').length; i++) {
            var num = parseInt($($('#other-list1 li')[i]).attr('data-num'), 10);
            if (num == indexOther) {
                $($('#other-list1 li')[i]).addClass('selected');
            } else {
                $($('#other-list1 li')[i]).removeClass('selected');
            }
        }
    }

}

/*it二级渲染*/
function renderItLevel2(fatherDom, index) {
    var currentData = fatherDom.categoryL2s;
    var html = "";
    //遍历数据，生成html
    for (var i = 0; i < currentData.length; i++) {
        var L2Name = currentData[i].name;
        html += '<li class="box-L2List-item" data-belong="categoryL2s" data-num=' + i + '>'
            + '<span>' + L2Name + '</span>'
            + '<i class="icon-arrow-right list-arrow"></i>'
            + '</li>';
    }
    $('#it-list2').html(html);
    //颜色标示出被选中的选项
    for (var i = 0; i < $('#it-list2 li').length; i++) {
        var num = parseInt($($('#it-list2 li')[i]).attr('data-num'), 10);
        if (num == index) {
            $($('#it-list2 li')[i]).addClass('selected');
        } else {
            $($('#it-list2 li')[i]).removeClass('selected');
        }
    }
}


/*三级渲染*/
function renderItLevel3(fatherDom, index) {
    var currentData = fatherDom.categoryL3s;
    var html = "";
    //遍历数据，生成html
    for (var i = 0; i < currentData.length; i++) {
        var L3Name = currentData[i].name;
        html += '<li class="box-L3List-item" data-belong="categoryL3s" data-num=' + i + '>'
            + '<span>' + L3Name + '</span>'
            + '<i class="icon-arrow-right list-arrow"></i>'
            + '</li>';
    }
    $('#it-list3').html(html);
    //颜色标示出被选中的选项
    for (var i = 0; i < $('#it-list3 li').length; i++) {
        var num = parseInt($($('#it-list3 li')[i]).attr('data-num'), 10);
        if (num == index) {
            $($('#it-list3 li')[i]).addClass('selected');
        } else {
            $($('#it-list3 li')[i]).removeClass('selected');
        }
    }
}


/*三级初次渲染+四级渲染*/
function renderLevel3(fatherData, currentRank, marker) {
    var html = "";
    var currentFatherData;
    var currentData = fatherData.funcLables;
    //有职级标签
    if (currentRank && currentRank.length != 0) {
        var rankhtml = "";
        for (var i = 0; i < currentRank.length; i++) {
            var rankName = currentRank[i].name;
            var rankId = currentRank[i].id;
            var selectedL5 = position.chooseTags.filter(function (item) {
                return (item.level == 5);
            });    //5为rank,职级标签

            var select = selectedL5.map(function (item) {
                return item.id;
            }).indexOf(parseInt(rankId, 10)) > -1;
            rankhtml += '<li class="levelList-item" data-id=' + rankId + ' data-num=' + i + '>'
                + '<span>' + rankName + '</span>'
                + '</li>';
        }
        $('#tag-rank-list').html(rankhtml);
        $tagRank.show();        //显示rank list
    } else {
        $tagRank.hide();
    }

    //it的类目情况
    if (position.sign == "it") {
        currentFatherData = position.chooseLevel3;
    } else {      //other的情况
        currentFatherData = position.chooseLevel1Other;
    }

    //有选中的情况
    if (position.chooseTags.length > 0) {
        //当前显示为已选择窗口
        if (fatherData == currentFatherData) {
            for (var i = 0; i < currentData.length; i++) {
                var L3Name = currentData[i].name;
                var L3Id = currentData[i].id;
                var selectedL3 = position.chooseTags.filter(function (item) {
                    return (item.level == 3);
                });
                var selected = selectedL3.map(function (item) {
                    return item.id;
                }).indexOf(parseInt(L3Id, 10)) > -1;
                html += '<li class="L3List-item " data-id=' + L3Id + ' data-fold="1"  data-num=' + i + '>'
                    + '<span>' + L3Name + '</span>'
                    + '</li>';
                if (selected) {
                    //三级被选中，展示四级列表
                    var L4Labels = currentData[i].relatedLables;
                    for (var j = 0; j < L4Labels.length; j++) {
                        var L4Name = L4Labels[j].name;
                        var L4Id = L4Labels[j].id;

                        html += '<li class="L4List-item" data-id=' + L4Id + ' data-fatherid=' + L3Id + ' data-num=' + j + '>'
                            + '<span>' + L4Name + '</span>'
                            + '</li>';
                    }
                } else {
                    var currentLevel4 = currentData[i].relatedLables;
                    for (var k = 0; k < currentLevel4.length; k++) {
                        var id = currentLevel4[k].id;
                        var selectedL4 = position.chooseTags.filter(function (item) {
                            return (item.level == 4);
                        });
                        var isExist = selectedL4.map(function (item) {
                            return item.id;
                        }).indexOf(parseInt(id, 10)) > -1;
                        if (isExist) {
                            for (var j = 0; j < currentLevel4.length; j++) {
                                var L4Name = currentLevel4[j].name;
                                var L4Id = currentLevel4[j].id;

                                html += '<li class="L4List-item" data-id=' + L4Id + ' data-fatherid=' + L3Id + ' data-num=' + j + '>'
                                    + '<span>' + L4Name + '</span>'
                                    + '</li>';
                            }
                        }
                    }
                }
            }
            //显示标签，隐藏文案
            renderChooseLevel(marker);
            $('.tag-bottom-reset').show();
        } else {
            //显示文案，隐藏选中标签
            $('.tag-list .tag-tips').show();
            $('.tag-list .tag-selected-top').hide();
            $('#boxJob .tag-bottom-left').hide();
            $('.tag-bottom-reset').hide();
            //渲染三级标签,默认情况
            for (var i = 0; i < currentData.length; i++) {
                var L3Name = currentData[i].name;
                var L3Id = currentData[i].id;
                html += '<li class="L3List-item " data-fold="1"  data-id=' + L3Id + ' data-num=' + i + '>'
                    + '<span>' + L3Name + '</span>'
                    + '</li>';
            }
        }
    } else {
        //显示文案，隐藏选中标签
        $('.tag-list .tag-tips').show();
        $('.tag-list .tag-selected-top').hide();
        //渲染三级标签,默认情况
        for (var i = 0; i < currentData.length; i++) {
            var L3Name = currentData[i].name;
            var L3Id = currentData[i].id;
            html += '<li class="L3List-item " data-fold="1"  data-id=' + L3Id + ' data-num=' + i + '>'
                + '<span>' + L3Name + '</span>'
                + '</li>';
        }
    }
    $('#tag-list3').html(html);
    $('#tag-list3').show();
}

//渲染top条目
function renderChooseLevel(marker) {
    var htmlTop = "";
    var allLables = getLablesData(marker);
    for (var i = 0; i < allLables.length; i++) {
        var topName = allLables[i].name;
        var topId = allLables[i].id;
        htmlTop += '<li class="tag-item" data-id=' + topId + ' data-num=' + i + ' >'
            + '<div class="tag-selected-item">'
            + '<span>' + topName + '</span>'
            + '<i class="tag-close icon-close2" data-id=' + topId + ' class="icon-close2">X</i>'
            + '</div> </li>'
    }
    $('#tag-selected').html(htmlTop);
    $('.tag-list .tag-tips').hide();
    $('.tag-list .tag-selected-top').show();
    if (allLables.length <= 0) {
        $('.tag-list .tag-tips').show();
        $('.tag-list .tag-selected-top').hide();
    } else {
        $('.tag-bottom-right .tag-bottom-reset').show();
    }
}

/*点击选择一级类别，展现二级列表/三级列表*/
$boxJob.on('mouseenter', '#it-list1 li, #other-list1 li', function (e) {
    var $me = $(this);
    var belong = $me.attr('data-belong');
    var num = $me.attr('data-num');

    if (belong == "it") {
        var fatherData = labelCacheBean.itCategoryL1List[num];

        //如果三级有选中的
        if (position.chooseTags.length > 0) {
            currShow.chooseLevel1 = fatherData;
            currShow.rankLables = fatherData.rankLables;
            currShow.level1Num = parseInt(num, 10);
        } else {              //如果三级没有选中
            position.chooseLevel1 = fatherData;         //记录下被选择的一级tag
            position.rankLables = fatherData.rankLables;
            position.level1Num = parseInt(num, 10);
            $('#boxJobInput span').text('请选择职位类别');
        }
        // 已有选中三级标签，点击当前已选中三级标签的条目
        if (fatherData == position.chooseLevel1) {
            currShow.chooseLevel1 = "";
            currShow.rankLables = "";
            currShow.level1Num = "";
        }

        //重新渲染一级列表
        renderLevel1(num, "");
        //重新渲染二级列表
        renderItLevel2(fatherData, 0);
        $tagList.hide();
        $itListThree.hide();
        $boxJob.css('width', '318px');
    } else {
        var fatherData = labelCacheBean.otherCategoryL1List[num];
        renderLevel1("", num);
        if (position.chooseTags.length > 0) {
            currShow.chooseLevel1Other = fatherData;
            currShow.rankLables = fatherData.rankLables;
            currShow.level1OtherNum = parseInt(num, 10);
            renderLevel3(currShow.chooseLevel1Other, currShow.rankLables, position);
        } else {
            position.chooseLevel1Other = fatherData;         //记录下被选择的一级tag
            position.rankLables = fatherData.rankLables;
            position.level1OtherNum = parseInt(num, 10);
            renderLevel3(position.chooseLevel1Other, position.rankLables, position);
            $('#boxJobInput span').text('请选择职位类别');
        }
        if (fatherData == position.chooseLevel1Other) {
            currShow.chooseLevel1Other = "";
            currShow.rankLables = "";
            currShow.level1OtherNum = "";
            currShow.otherChooseAgain = true;
        } else {
            currShow.otherChooseAgain = false;
        }

    }
    e.stopPropagation();
    e.preventDefault();
});

/*点击选择二级类别，展现三级列表*/
$boxJob.on('mouseenter', '#it-list2 li', function (e) {
    var $me = $(this);
    var num = $me.attr('data-num');
    var fatherData;
    if (currShow.chooseLevel1 != "") {
        fatherData = currShow.chooseLevel1.categoryL2s[num];
    } else {
        fatherData = position.chooseLevel1.categoryL2s[num];
    }

    if (position.chooseTags.length > 0) {
        currShow.chooseLevel2 = fatherData;         //记录下被选择的二级tag
        currShow.level2Num = parseInt(num, 10);
        if (currShow.chooseLevel1 != "") {
            currShow.rankLables = currShow.chooseLevel1.rankLables;
        } else {
            currShow.rankLables = position.chooseLevel1.rankLables;
        }
        if ($me.text() == "管理岗") {
            currShow.rankLables = "";
        }
        if (currShow.chooseLevel1 == "") {
            currShow.chooseLevel1 = position.chooseLevel1;
            currShow.rankLables = position.rankLables;
            currShow.level1Num = position.level1Num;
        }
        renderItLevel2(currShow.chooseLevel1, num);
        renderItLevel3(fatherData, 0);

    } else {              //如果三级没有选中
        position.chooseLevel2 = fatherData;         //记录下被选择的二级tag
        position.rankLables = position.chooseLevel1.rankLables;
        position.level2Num = parseInt(num, 10);
        if ($me.text() == "管理岗") {
            position.rankLables = "";
        }
        renderItLevel2(position.chooseLevel1, num);
        renderItLevel3(fatherData, 0);
        $('#boxJobInput span').text('请选择职位类别');
    }
    if (fatherData == position.chooseLevel2) {
        // currShow.chooseLevel2 = "";
        // currShow.rankLables = "";
        // currShow.level2Num = "";
        // currShow.itChooseAgain = true;
    } else {
        // currShow.itChooseAgain = false;
    }

    $tagList.hide();
    $itListThree.show();
    $boxJob.css('width', '476px');
    e.stopPropagation();
    e.preventDefault();
});

/*点击选择三级类别，展现四级列表*/
$boxJob.on('mouseenter', '#it-list3 li', function (e) {
    var $me = $(this);
    var num = $me.attr('data-num');
    var fatherData;
    if (currShow.chooseLevel2 != "") {
        fatherData = currShow.chooseLevel2.categoryL3s[num];
    } else {
        fatherData = position.chooseLevel2.categoryL3s[num];
    }

    if (position.chooseTags.length > 0) {
        currShow.chooseLevel3 = fatherData;         //记录下被选择的三级tag
        currShow.level3Num = parseInt(num, 10);
        if (currShow.chooseLevel1 != "") {
            currShow.rankLables = currShow.chooseLevel2.rankLables;
        } else {
            currShow.rankLables = position.chooseLevel2.rankLables;
        }
        if ($me.text() == "管理岗") {
            currShow.rankLables = "";
        }
        if (currShow.chooseLevel1 == "") {
            currShow.chooseLevel1 = position.chooseLevel1;
            currShow.rankLables = position.rankLables;
            currShow.level1Num = position.level1Num;
        }
        renderItLevel3(currShow.chooseLevel2 ? currShow.chooseLevel2 : position.chooseLevel2, num);
        renderLevel3(fatherData, currShow.rankLables, position);

    } else {              //如果三级没有选中
        position.chooseLevel3 = fatherData;         //记录下被选择的二级tag
        position.rankLables = position.chooseLevel1.rankLables;
        position.level3Num = parseInt(num, 10);
        if ($me.text() == "管理岗") {
            position.rankLables = "";
        }
        renderItLevel3(position.chooseLevel2, num);
        renderLevel3(fatherData, position.rankLables, position);
        $('#boxJobInput span').text('请选择职位类别');
    }
    if (fatherData == position.chooseLevel3) {
        currShow.chooseLevel3 = "";
        currShow.rankLables = "";
        currShow.level3Num = "";
        currShow.itChooseAgain = true;
    } else {
        currShow.itChooseAgain = false;
    }

    $tagList.show();
    $boxJob.css('width', '838px');
    e.stopPropagation();
    e.preventDefault();
});

/*点击选择标签＋展开4级标签+rank的点击选择*/
$boxJob.on('click', '#tag-list3 li,#tag-rank-list li', function (e) {
    var $me = $(this);
    var isLevel3 = $me.hasClass('L3List-item');
    var isLevelRank = $me.hasClass('levelList-item');
    var thisId = parseInt($me.attr('data-id'), 10);
    var thisNum = parseInt($me.attr('data-num'), 10);
    var thisName = $me.children('span').text();
    var data;
    position.flag = false;

    //判断点击的是currentShow 还是position里的数据
    if (position.sign == "it") {
        // (currShow.chooseLevel1 != "" || currShow.chooseLevel2 != "" || currShow.chooseLevel3 != "") && 
        if (!currShow.itChooseAgain) {
            clearData2();
            currShow.itChooseAgain = true;
            if (currShow.chooseLevel1 != "") {
                position.chooseLevel1 = currShow.chooseLevel1;
                position.level1Num = currShow.level1Num;
                currShow.chooseLevel1 = "";
            }
            if (currShow.chooseLevel2 != "") {
                position.chooseLevel2 = currShow.chooseLevel2;
                position.rankLables = currShow.rankLables;
                position.level2Num = currShow.level2Num;
            }

            position.chooseLevel3 = currShow.chooseLevel3;
            position.level3Num = currShow.level3Num;
            // currShow.chooseLevel2 = "";
            // currShow.rankLables = "";
            // currShow.level2Num = "";
        }
    } else {
        if (currShow.chooseLevel1Other != "" && !currShow.otherChooseAgain) {
            clearData2();
            position.chooseLevel1Other = currShow.chooseLevel1Other;
            position.rankLables = currShow.rankLables;
            position.level1OtherNum = currShow.level1OtherNum;
            currShow.chooseLevel1Other = "";
            currShow.rankLables = "";
            currShow.level1OtherNum = "";
        }
    }

    //判断显示6个标签
    if (position.chooseTags.length >= MaxChooseTag) {
        $('#boxJob .tag-bottom-left').show();
    }

    //改变数据
    var tmpDatas = position.chooseTags.map(function (item) {
        return item.id;
    });
    var index = tmpDatas.indexOf(thisId) > -1;
    var count = position.chooseTags.length;
    if (isLevel3) {
        var fold = parseInt($me.attr('data-fold'), 10);
        //变数据
        if (!index && count < MaxChooseTag) {
            position.chooseTags.push({
                id: thisId,
                name: thisName.trim(),
                level: 3
            });
        }
        //变ui,展开与否
        if (fold) {       //未展开情况
            //判断是否有选择的标签
            if (position.chooseTags.length > 0) {
                if (position.sign == "it") {
                    if (currShow.chooseLevel3 == "") {
                        fatherData = position.chooseLevel3;
                    } else
                        fatherData = currShow.chooseLevel3;
                } else {
                    if (currShow.chooseLevel1Other == "") {
                        fatherData = position.chooseLevel1Other;
                    }
                }
            } else {
                if (position.sign == "it") {
                    fatherData = position.chooseLevel3;
                } else {
                    fatherData = position.chooseLevel1Other;
                }
            }
            //当前显示三级类目
            var currentShow = fatherData.funcLables;
            //当前选中节点的四级标签
            var currentShow4 = currentShow[thisNum] ? currentShow[thisNum].relatedLables : [];
            var html = "";
            if (currentShow4.length > 0) {
                for (var i = 0; i < currentShow4.length; i++) {
                    var L4Name = currentShow4[i].name;
                    var L4Id = currentShow4[i].id;
                    html += '<li class="L4List-item" data-id=' + L4Id + ' data-fatherid=' + thisId + ' data-num=' + i + '>'
                        + '<span>' + L4Name + '</span>'
                        + '</li>';
                }
                $me.after(html);
                $me.attr('data-fold', '0');
            }
        } else {
            for (var i = 0; i < $('#tag-list3 li').length; i++) {
                var fatherId = parseInt($($('#tag-list3 li')[i]).attr('data-fatherid'), 10);
                var thisClass = $($('#tag-list3 li')[i]).hasClass('L4List-item');
                if (thisClass && fatherId && fatherId == thisId) {
                    $('#tag-list3 li')[i].remove();
                    i--;
                }
            }
            $me.attr('data-fold', '1');
        }
    } else if (isLevelRank) {
        if (!index && count < MaxChooseTag) {
            position.chooseTags.push({
                id: thisId,
                name: thisName.trim(),
                level: 5
            });
        }
    } else {
        if (!index && count < MaxChooseTag) {
            position.chooseTags.push({
                id: thisId,
                name: thisName.trim(),
                level: 4
            });
        }
    }

    //渲染已选择条目
    renderChooseLevel(position);

    //判断隐藏重置按钮
    if (position.chooseTags.length <= 0) {
        $('.tag-bottom-right .tag-bottom-reset').hide();
    } else {
        $('.tag-bottom-right .tag-bottom-reset').show();
    }

    //显示类别
    showTagToBox();
});


//点击删除标签    职位类别下拉菜单中的删除标签按钮
$boxJob.on('click', '.tag-close', function () {
    var $me = $(this);
    var id = parseInt($me.attr('data-id'), 10);
    //变数据
    if (position.chooseTags.length > 0) {
        var tmpTags = position.chooseTags.map(function (item) {
            return item.id;
        });
        var indexbe = tmpTags.indexOf(id);
        if (indexbe > -1) {
            position.chooseTags.splice(parseInt(indexbe, 10), 1);
        }
    }


    //刷新UI
    $me.parents('li').remove();
    var labelsData = position.chooseTags.length;
    if (labelsData <= 0) {
        $('.tag-list .tag-tips').show();
        $('.tag-list .tag-selected-top').hide();
        $('.tag-bottom-reset').hide();
    }
    if (labelsData < MaxChooseTag) {
        $('.tag-bottom .tag-bottom-left').hide();
    }
    //显示类别
    showTagToBox();
});

/*点击查看其他类别*/
$boxJob.on('click', '.it-list .list-tagmore', function (e) {
    position.rankLables = position.chooseLevel1Other.rankLables;
    $boxJob.css('width', '570px');
    clearData1();
    clearData2();
    position.sign = "other";

    renderChange();
    rewriteData();

    e.stopPropagation();
    e.preventDefault();

});


/*点击查看互联网类别*/
$boxJob.on('click', '.other-list .list-tagmore', function (e) {
    position.rankLables = position.chooseLevel1.rankLables;
    clearData1();
    clearData2();
    position.sign = "it";

    renderChange();
    rewriteData();

    e.stopPropagation();
    e.preventDefault();
});

// //渲染滚动条的UI
// $('#boxJob .flowed').niceScroll({
//     'cursorborder': 'none',
//     'cursorcolor': '#00b38a',
//     'cursorwidth': '4px',
//     'scrollspeed': '6'
// });

//点击重置
$boxJob.on('click', '.tag-bottom-reset', function (e) {
    // $boxJob.css('width', '318px');
    $(this).hide();
    // $tagList.hide();
    // $itListThree.hide();
    $('.tag-bottom-left').hide();
    position.chooseTags = [];
    if (position.sign == "it") {
        renderLevel3(position.chooseLevel3, position.rankLables, position);
    }
    if (position.sign == "other") {
        renderLevel3(position.chooseLevel1Other, position.rankLables, position);
    }
    showTagToBox();
    $('#boxJobInput span').text('请选择职位类别');
    // $('#boxJob .tag-bottom-right .tag-bottom-sure').click();
    e.stopPropagation();
    e.preventDefault();
});

//点击确定按钮
$('#boxJob').on('click', '.tag-bottom-right .tag-bottom-sure', function (e) {
    $('#boxJob').hide();
    $itListThree.hide();
    position.flag = true;
    saveDatas.chooseTags = position.chooseTags.map(function (item) {
        return $.extend({}, item);
    }); // 深复制

    if (saveDatas.chooseTags.length > 0) {
        if (position.sign == "it") {
            var positionSend = $('#boxJobInput span').text();
            var types = positionSend.split('-');
            $('#positionType').val(types[1].trim());
            $("#firstType").val(types[0].trim());
            saveDatas.chooseLevel1 = position.chooseLevel1;
            saveDatas.chooseLevel2 = position.chooseLevel2;
            saveDatas.chooseLevel3 = position.chooseLevel3;
            saveDatas.level1Num = position.level1Num;
            saveDatas.level2Num = position.level2Num;
            saveDatas.level3Num = position.level3Num;
            saveDatas.rankLables = position.rankLables;
        } else {
            $('#positionType').val($('#boxJobInput span').text());
            $("#firstType").val('其他');
            saveDatas.chooseLevel1Other = position.chooseLevel1Other;
            saveDatas.level1OtherNum = position.level1OtherNum;
            saveDatas.rankLables = position.rankLables;
        }
        saveDatas.choosePositions = $('#boxJobInput span').text();
        chooseStyle = position.sign;
    } else {
        $('#boxJobInput span').text('请选择职位类别');
        $('#positionType').val("");
        $("#firstType").val("");
        saveDatas.choosePositions = null;
    }
    // renderTags();
    if ($('#positionType').hasClass("error")) {
        if ($("#boxJobInput span").text() != ('请选择职位类别' || "")) {
            $('#positionType').removeClass('error');
            $('#positionType-error').hide();
        }
    }

    e.stopPropagation();
    e.preventDefault();
});

function getLablesData(marker) {
    //最后确定的时候在遍历,存选择的数据
    var prePositionLables = [];
    prePositionLables = marker.chooseTags.map(function (item) {
        delete item.level;
        return item;
    });

    return prePositionLables;
}

//去重
function noRepeat(id, checkData) {
    var repeat = false;
    for (var i = 0; i < checkData.length; i++) {
        if (checkData[i].id == id) {
            repeat = true;
        }
    }
    return repeat;
}

// --------------------------------------------- 职位部分结束 -----------------------------------------

//渲染标签
function renderTags() {
    var collectDatas = mergeData();
    var html = "";
    for (var i = 0; i < collectDatas.length; i++) {
        var name = collectDatas[i].name;
        var id = (collectDatas[i].id ? true : false);
        var isForbiddenLabel = collectDatas[i].isForbiddenLabel ? true : false;
        html += '<li> <div class="position-label-item ' + (isForbiddenLabel ? 'forbidden-word' : '') + '">'
            + '<span>' + name + '</span>'
            + (id ? '' : '<i class="icon-close2"></i>')
            + (isForbiddenLabel ? '<span class="forbidden-label-tips"><i class="icon-warning"></i>标签不合适</span>' : '')
            + '</div>'
            + '</li>';
        // if(id){
        //     html += '<li> <div class="position-label-item">'
        //         +'<span>'+ name +'</span>'
        //         +'</div>'
        //         +'</li>';
        // }else{
        //     html += '<li> <div class="position-label-item">'
        //         +'<span>'+ name +'</span>'
        //         +'<i class="icon-close2"></i>'
        //         +'</div>'
        //         +'</li>';
        // }
    }
    $('.position-label').html(html);
    if (collectDatas.length >= MaxChooseTag) {
        $('.position-label-write').css('display', 'none');   // 贴上框
        $('.position-label-add').hide();    //＋按钮
        $('.position-label-wa').val("");
    }
    if (collectDatas.length < MaxChooseTag) {
        if ($('.position-label-write').is(':hidden')) {
            $('.position-label-add').show();    //＋按钮
        }
        $('.position-label-wa').val("");
    }
    if ($('#labeled').hasClass('error') && collectDatas.length != 0) {
        $('#labeled-error').hide();
        $('#labeled').removeClass('error');
    }
    showFirstForbiddenTips()
}


function mergeData() {
    var collectDatas = [];
    if (saveDatas.choosePositions != null) {
        // 通过职位类别点选了职位标签
        collectDatas = getLablesData(saveDatas);

        if (collectDatas.length >= MaxChooseTag) {
            collectDatas = collectDatas.splice(0, MaxChooseTag);
            return collectDatas;
        }
    }

    if (labelsForeign.length > 0) {
        // 通过输入职位名称从后端接口取得的职位标签
        var tmp = [];
        for (var i = 0; i < labelsForeign.length; i++) {
            var found = false;
            for (var j = 0; j < collectDatas.length; j++) {
                if (labelsForeign[i].toUpperCase() == collectDatas[j].name.toUpperCase()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                tmp.push({ "name": labelsForeign[i] });
            }
        }
        collectDatas = collectDatas.concat(tmp);
    }

    if (collectDatas.length >= MaxChooseTag) {
        collectDatas = collectDatas.splice(0, MaxChooseTag);
        return collectDatas;
    }


    if (labels.saved.length > 0) {
        //通过手动输入或者编辑职位页该职位所带的职位标签
        var ls = labels.saved;
        var tmp = [];
        for (var i = 0; i < ls.length; i++) {
            var found = false;
            for (var j = 0; j < collectDatas.length; j++) {
                if (ls[i].name.toUpperCase() == collectDatas[j].name.toUpperCase()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (typeof ls[i].isForbiddenLabel === 'undefined') {
                    tmp.push({ "name": ls[i].name, "id": parseInt(ls[i].id, 10) });
                } else {
                    tmp.push({ "name": ls[i].name, "id": parseInt(ls[i].id, 10), "isForbiddenLabel": ls[i].isForbiddenLabel });
                }

            }
        }
        collectDatas = collectDatas.concat(tmp);
    }

    if (collectDatas.length >= MaxChooseTag) {
        collectDatas = collectDatas.splice(0, MaxChooseTag);
    }

    return collectDatas;
}
function showTagToBox() {
    if (position.sign == "it") {
        $('#boxJobInput span').text(position.chooseLevel1.name + ' - ' + position.chooseLevel2.name + ' - ' + position.chooseLevel3.name);
        $tagShow.html(position.chooseTags.map(function (item) { return "<li>" + item.name + "</li>" }))
    } else {
        $('#boxJobInput span').text(position.chooseLevel1Other.name);
    }
}