// var categories = ["Japanese", "Chinese", "Canadian", "Thai", "Pizza", "Vegetarian", "Italian", "coffee"];
var colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57'];
var categories = ["Japanese", "Chinese", "Cafe", "Steak"];
var data = [{
    name: '',
    itemStyle: {
        color: "#808080"
    },
    children: []
}];
var itemStyle = {
    star5: {
        color: colors[3]
    },
    star4: {
        color: colors[1]
    },
    star3: {
        color: colors[0]
    },
    star2: {
        color: colors[0]
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

var dom = document.getElementById("baguazhen");
var myChart = echarts.init(dom);
var app = {};
option = null;

// data[0] is designed to be the GoBack button.
function updateColor() {
    var category = data[0].children;
    for (var i = 0; i < category.length; ++i) {
        var block = category[i].children;

        // for restaurant bucket
        for (var star = 0; star < block.length; ++star) {
            var style = (function (name) {
                switch (true) {
                    case (name == '4 - 5'):
                        return itemStyle.star5;
                    case (name == '3 - 4'):
                        return itemStyle.star4;
                    case (name == '3'):
                        return itemStyle.star2;
                    default:
                        return itemStyle.star2;
                }
            })(block[star].name);

            block[star].label = {
                color: '#fff',
                downplay: {
                    opacity: 0.8
                }
            };

            // for each single restaurant
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
                });
            }
        }
        category[i].itemStyle = {
            color: category[i].itemStyle.color
        };
    }
}

var bgColor = 'rgba(46, 39, 51, 0.85)';
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
            color: '#fff'
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
            r: 120
        }, {
            r0: 125,
            r: 150,
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
            r0: 155,
            r: 175,
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
                    opacity: 0.7
                }
            }
        }]
    }]
};

