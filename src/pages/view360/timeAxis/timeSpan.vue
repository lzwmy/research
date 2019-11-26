<template>
    <div class="costRange">
        <input type="text" id="costRange">
    </div>
</template>

<script>
import '../../../../static/ionRangeSlider/ion.rangeSlider.min.js'
import '../../../../static/ionRangeSlider/ion.rangeSlider.css'
export default {
    name:'timeSpan',
    props: {
        startTime: {
            type: String,
            default: ""
        },
        endTime: {
            type: String,
            default: ""
        }
    },
    data () {       
        return {
            
        };
    },
    mounted () {
        this.$nextTick(() => {
            let that = this;
            let startTimeArr = this.startTime.split("-");
            let endTimeArr = this.endTime.split("-");
            let startTime = {
                year: Number(startTimeArr[0]),
                month: Number(startTimeArr[1])-1,
                day: Number(startTimeArr[2].slice(0,2))
            } 
            let endTime = {
                year: Number(endTimeArr[0]),
                month: Number(endTimeArr[1])-1,
                day: Number(endTimeArr[2].slice(0,2))
            } 
            $("#costRange").ionRangeSlider({
       type: "double",  //双个滑块
                min: this.dateToTS(new Date(startTime.year, startTime.month, startTime.day)),
                max: this.dateToTS(new Date(endTime.year, endTime.month, endTime.day)),
                from: this.dateToTS(new Date(startTime.year, startTime.month, startTime.day)),
                to: this.dateToTS(new Date(endTime.year, endTime.month, endTime.day)),
                prettify: this.tsToDate,  
                grid_num: 12,  //单元格数
       grid: true,//滑块上方显示网格
                onFinish: function (data) {
                    that.$emit('changeTimeSpan',{
                        startTime: data.from,
                        endTime: data.to
                    })
                },
      });
            Array.from($('.irs-grid .irs-grid-text')).forEach( item=>{
                $(item).text($(item).text().slice(5));
            })

        });
    },
    methods: {
        dateToTS (date) {
            return date.valueOf();
        },
        tsToDate (ts) {
            var d = new Date(ts);
            return d.toLocaleDateString('JA-JA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
    },
}
</script>

<style lang="less">
    body .timeAxis {
        .costRange {
            .irs-line {
                height: 40px;
                background-color: #f5f5f4;
            }
            .irs--flat {
                height: 110px;
            }
            .irs-grid {
                bottom: 0;
                .irs-grid-pol {
                    margin-left: 1px;
                    height: 20px;
                    z-index: 10;
                    background-color: #ccc;
                    top: auto;
                    bottom: 45px !important;
                }
                .irs-grid-pol.small {
                    height: 10px;
                }
            }
            .irs-bar {
                height: 40px;
                background-color: #deeffe;
            }
            .irs-handle {
                height: 48px;
                cursor: ew-resize;
                z-index: 20;
                i:first-child {
                    background-color: #6ba4f0;
                }
            }
            .irs-from,
            .irs-to,
            .irs-single {
                background-color: #6ba4f0;
            }
            .irs-single::before,
            .irs-to::before,
            .irs-from::before {
                    border-top-color: #6ba4f0;
            }
        }
    }
</style>
