<template>
    <div id="customerChart" style=" height: 190px; margin: 0 auto;">

    </div>
</template>
<script>
import { inject, onMounted, watchEffect } from "vue"
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/component/dataZoom");
export default {
    name: 'LineCharts',
    props: ['date', 'dataArr', 'reloadNum'],
    
    watch: {
        reloadNum() {
            this.chartShow();
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.chartShow();
        });
    },
    methods: {
        chartShow() {
            let myChart = echarts.init(document.getElementById("customerChart"));
            myChart.setOption({
                title: {
                    text: "近7天交易量",
                    textStyle: {
                        color: '#333333',
                        fontSize: 13,
                        fontWeight: "500",
                    }
                },
                legend: {
                    right: 'center'
                },
                grid: {
                    left: 27,
                    right: 7,
                    top: 40,
                    bottom: 34
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter: function (data) {
                        return (
                            '<span style="font-size:10px">' +
                            data[0].name +
                            '</span><br><table ><tr><td style="padding:0">' +
                            '<span style="font-size:10px;">' + '交易量' + '：' +
                            data[0].value + '笔' +
                            "</a></span><br></td></tr></table>"
                        );
                    }
                },
                xAxis: {
                    data: this.date,
                    axisLine: {
                        lineStyle: {
                            color: "#e9e9e9",
                            width: 2
                        }
                    },
                    axisLabel: {
                        // interval: 1,
                        textStyle: {
                            color: "rgba(0,14,31,0.62)"
                        },
                        rotate: 40,
                        fontSize: 12
                    }
                },
                yAxis: {
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "#333"
                        }
                    },
                    splitLine: { show: true, lineStyle: { type: "dashed", color: "#e9e9e9" } },
                    axisTick: { show: false },
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value > 1000 && value < 1000000) {
                                return value / 1000 + "K";
                            } else if (value > 1000000 || value === 1000000) {
                                return value / 1000000 + "M";
                            } else {
                                return value + "";
                            }
                        },
                        textStyle: {
                            color: "rgba(0,14,31,0.62)"
                        },
                        fontSize: 12
                    }
                },
                series: [
                    {
                        type: "line",
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                color: "#5C86DA",
                                lineStyle: {
                                    color: "#5C86DA",
                                    width: 2
                                }
                            }
                        },
                        areaStyle: {
                            color: '#5C86DA'
                        },
                        data: this.dataArr
                    }
                ],
            });
            window.onresize = function () {
                myChart.resize();
            };
        }
    },

    // setup(props) {

    //     watchEffect(() => {
    //         console.log(props.reloadNum, 'reloadNum');
    //     })

    //     let echarts = inject("ec");
    //     onMounted(() => {
    //         initChart()
    //     })
    //     const initChart = () => {
    //         let myChart = echarts.init(document.getElementById("customerChart"));
    //         myChart.setOption({
    //             title: {
    //                 text: "近7天交易量",
    //                 textStyle: {
    //                     color: '#727476',
    //                     fontSize: 14,
    //                     fontWeight: "normal",
    //                 }
    //             },
    //             legend: {
    //                 right: 'center'
    //             },
    //             grid: {
    //                 left: 43,
    //                 right: 33,
    //                 top: 50,
    //                 bottom: 20
    //             },
    //             tooltip: {
    //                 show: true,
    //                 trigger: "axis",
    //                 formatter: function (data) {
    //                     console.log('xxxxxx', data);
    //                     return (
    //                         '<span style="font-size:10px">' +
    //                         data[0].name +
    //                         '</span><br><table ><tr><td style="padding:0">' +
    //                         '<span style="font-size:10px;color:white">' + '交易量' + '：' +
    //                         data[0].value + '笔' +
    //                         "</a></span><br></td></tr></table>"
    //                     );
    //                 }
    //             },
    //             xAxis: {
    //                 data: props.date,
    //                 axisLine: {
    //                     lineStyle: {
    //                         color: "#e9e9e9",
    //                         width: 2
    //                     }
    //                 },
    //                 axisLabel: {
    //                     interval: 1,
    //                     textStyle: {
    //                         color: "rgba(0,14,31,0.62)"
    //                     }
    //                 }
    //             },
    //             yAxis: {
    //                 axisLine: {
    //                     show: false,
    //                     lineStyle: {
    //                         color: "#333"
    //                     }
    //                 },
    //                 splitLine: { show: true, lineStyle: { type: "dashed", color: "#e9e9e9" } },
    //                 axisTick: { show: false },
    //                 axisLabel: {
    //                     formatter: function (value, index) {
    //                         if (value > 1000 && value < 1000000) {
    //                             return value / 1000 + "K";
    //                         } else if (value > 1000000 || value === 1000000) {
    //                             return value / 1000000 + "M";
    //                         } else {
    //                             return value + "";
    //                         }
    //                     },
    //                     textStyle: {
    //                         color: "rgba(0,14,31,0.62)"
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     type: "line",
    //                     symbolSize: 1,
    //                     itemStyle: {
    //                         normal: {
    //                             color: "#0db1c1",
    //                             lineStyle: {
    //                                 color: "#0db1c1"
    //                             }
    //                         }
    //                     },
    //                     areaStyle: {
    //                         color: 'rgba(13, 177, 193,0.3)'
    //                     },
    //                     data: props.dataArr
    //                 }
    //             ],
    //         });
    //         window.onresize = function () {
    //             myChart.resize();
    //         };
    //     }
    //     return {
    //         echarts,
    //     }
    // }
}
</script>
<style scoped>
#customerChart{
    background: #FFFFFF;
box-shadow: 0 0 10px 0 rgba(201,223,255,0.50);
border-radius: 6px;
padding: 12px;
}
</style>