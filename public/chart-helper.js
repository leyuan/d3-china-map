var bgColor = 'rgba(46, 39, 51, 0.75)';
var colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57'];
var maxRestaurantsToDisplay = 10; // 什么鬼名字
// var categories = ["Japanese", "Chinese", "Canadian", "Thai", "Pizza", "Vegetarian", "Italian", "coffee"];
var categories = ["Japanese", "Chinese", "Cafe"];
var data = [{
    name: '',
    itemStyle: {
        color: "#808080"
    },
    children: []
}];
var itemStyle = {
    star5: {
        color: colors[0]
    },
    star4: {
        color: colors[1]
    },
    star3: {
        color: colors[2]
    },
    star2: {
        color: colors[3]
    }
};

// Generate data.
categories.map((cate, i) => {
    var item = {
        name: cate,
        itemStyle: {
            color: colors[(i % (colors.length))]
        },
        children: []
    };

    data[0].children.push(item);
});

// for (var i = 0; i < categories.length; i++) {
//     data[0].children.push({
//         name: "",
//         itemStyle: {
//             color: colors[(i % (colors.length))]
//         },
//         children: []
//     });
//     data[0].children[i].name = categories[i];
//     for (var j = 0; j < maxRestaurantsToDisplay; j++) {
//         data[0].children[i].children.push({
//             name: '☆',
//             children: [{
//                 name: ''
//             }]
//         });
//     }
// }

var dom = document.getElementById("baguazhen");
var myChart = echarts.init(dom);
var app = {};
option = null;

// data[0] is designed to be the GoBack button.
function updateColor() {
    var category = data[0].children;
    for (var i = 0; i < category.length; ++i) {
        var block = category[i].children;
        var bookScore = [];
        var bookScoreId;
        for (var star = 0; star < block.length; ++star) {
            var style = (function (name) {
                name = parseFloat(name.slice(0, 3)); // Extract the numerical part.
                switch (true) {
                    case (name >= 4.6):
                        bookScoreId = 0;
                        return itemStyle.star5;
                    case (name < 4.6 && name >= 4.3):
                        bookScoreId = 1;
                        return itemStyle.star4;
                    case (name < 4.3 && name >= 4.0):
                        bookScoreId = 2;
                        return itemStyle.star3;
                    case (name < 4.0):
                        bookScoreId = 3;
                        return itemStyle.star2;
                    default:
                        bookScoreId = 0;
                        return itemStyle.star5;
                }
            })(block[star].name);

            block[star].label = {
                color: style.color,
                downplay: {
                    opacity: 0.5
                }
            };
            if (block[star].children) {
                style = {
                    opacity: 1,
                    color: style.color
                };
                block[star].children.forEach(function (book) {
                    book.value = 1;
                    book.itemStyle = style;
                    book.label = {
                        color: style.color
                    };

                    var value = 1;
                    if (bookScoreId === 0 || bookScoreId === 3) {
                        value = 5;
                    }
                    if (bookScore[bookScoreId]) {
                        bookScore[bookScoreId].value += value;
                    } else {
                        bookScore[bookScoreId] = {
                            color: colors[bookScoreId],
                            value: value
                        };
                    }
                });
            }
        }
        category[i].itemStyle = {
            color: category[i].itemStyle.color
        };
    }
}

option = {
    backgroundColor: bgColor,
    color: colors,
    series: [{
        type: 'sunburst',
        center: ['50%', '48%'],
        data: data,
        sort: function (a, b) {
            if (a.depth === 1) {
                return b.getValue() - a.getValue();
            } else {
                return a.dataIndex - b.dataIndex;
            }
        },
        label: {
            rotate: 'radial',
            color: bgColor
        },
        itemStyle: {
            borderColor: bgColor,
            borderWidth: 2
        },
        levels: [{}, {
            r0: 0,
            r: 20,
            label: {
                rotate: 0
            }
        }, {
            r0: 20,
            r: 105
        }, {
            r0: 115,
            r: 140,
            itemStyle: {
                shadowBlur: 2,
                shadowColor: colors[2],
                color: 'transparent'
            },
            label: {
                rotate: 'tangential',
                fontSize: 10,
                color: colors[0]
            }
        }, {
            r0: 140,
            r: 145,
            itemStyle: {
                shadowBlur: 80,
                shadowColor: colors[0]
            },
            label: {
                position: 'outside',
                textShadowBlur: 5,
                textShadowColor: '#333',
            },
            downplay: {
                label: {
                    opacity: 0.5
                }
            }
        }]
    }]
};;
if (option && typeof option === "object") {
    updateColor();
    myChart.setOption(option, true);
    updateColor();
}