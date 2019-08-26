export const printStyle = 
`
<style>
    html, body {
        margin:0;
    }
    ul li {
        list-style: none outside none;
    }
    .com_text_align {
        text-align: center;
    }
    .flex {
        display: flex;
        display: -ms-flexbox;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }
    input {
        margin: 0;
        vertical-align: middle;
    }
    table {
        border-collapse:collapse; 
        border-spacing:0; 
    }
</style>

<style>
            .container {
            border: 1px solid #ccc;
            margin: 35px 0 0;
            padding: 0 15px;
            position: relative;
            height: auto;
            width: 732px;
            color: #777;
            font-size: 12px;
            }
            .container .head_fixed {
            height: 60px;
            position: absolute;
            top: 10px;
            right: 10px;
            left: 10px;
            padding: 15px 0;
            border-bottom: 1px solid #ccc;
            }
            .container .head_fixed.shadow {
            box-shadow: 0px 0px 3px #333;
            }
            .container .head_fixed .report_title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #63666E;
            margin-bottom: 10px;
            }
            .container .head_fixed ul {
            display：none;
            }
            .container .head_fixed ul li {
            padding: 0 15px;
            }
            .container .head_fixed ul li p {
            display: inline-block;
            position: relative;
            min-width: 140px;
            color: #666;
            border-bottom: 1px solid #ddd;
            }
            .container .head_fixed ul li p:after {
            content: "";
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            width: 100%;
            background: #ddd;
            height: 1px;
            }
            .container .content {
            overflow: auto;
            position: absolute;
            top: 95px;
            left: 10px;
            right: 10px;
            bottom: 40px;
            }
            .container .content .box {
            border: 1px solid #ccc;
            margin-bottom: 15px;
            }
            .container .content .box:first-child {
            border-top: none;
            }
            .container .content .box .box_title {
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            background: #F7F8FC;
            
            }
            .container .content .box .box_title .el-checkbox {
            font-weight: bold;
            vertical-align: middle;
            display: flex;
            display: -ms-flexbox;
            -ms-flex-pack: start;
            justify-content: flex-start;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            
            align-items: center;
            }
            .container .content .box .box_title .el-checkbox .el-checkbox__label{
                margin-left: 5px;
            }   
            .container .content .box .box_body {
            padding: 10px 15px;
            }
            .container .content .box .box_body h3 {
            font-size: 14px;
            font-weight: normal;
            color: #111;
            margin-bottom: 5px;
            }
            .container .content .box .box_body .box_cont {
            padding: 5px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: start;
                justify-content: flex-start;
            -ms-flex-wrap: wrap;
                flex-wrap: wrap;
            }
            .container .content .box .box_body .box_cont li {
            display: inline-block;
            padding: 0 ;
            }
            .container .content .box .box_body .box_cont li span.label {
            display: inline-block;
            min-width: 60px;
            text-align: right;
            }
            .container .content .box .box_body .box_cont li span.label ~ div {
            min-width: 100px;
            }
            .container .content .box .box_body .box_cont li p.label-text {
            display: inline-block;
            position: relative;
            min-width: 70px;
            text-align: center;
            color: #777;
            margin: 0;
            vertical-align: bottom;
            border-bottom: 1px solid #ddd;
            }
            .container .content .box .box_body .box_cont li p.label-text:after {
            content: '';
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            width: 100%;
            background: #ddd;
            height: 1px;
            }
            .container .content .box .box_body .box_cont li .text2 span {
            position: relative;
            min-width: 80px;
            text-align: center;
            display: inline-block;
            margin-right: 5px;
            border-bottom: 1px solid #ddd;
            }
            .container .content .box .box_body .box_cont li .text2 span:after {
            content: "";
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            width: 100%;
            background: #ddd;
            height: 1px;
            }
            .container .content .box .box_body .box_cont li.flex {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: start;
                justify-content: flex-start;
            -ms-flex-wrap: wrap;
                flex-wrap: wrap;
            }
            .container .content .box .box_body .box_cont li.flex > div {
            padding: 5px 15px;
            }
            .container .box_underline {
            display: inline-block;
            position: relative;
            min-width: 160px;
            vertical-align: bottom;
            text-align: center;
            border-bottom: 1px solid #ddd;
            }
            .container .box_underline:after {
            content: "";
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            width: 100%;
            background: #ddd;
            height: 1px;
            }
            .container .indent {
            font-size: 14px;
            color: #444;
            }
            .container {
            height: auto;
            }
            .container .head_fixed,
            .container .content {
            position: relative;
            overflow: visible;
            left: 0;
            right: 0;
            width:100%;
            }
            .container .content {
            top: 11px;
            }
            .box_table {
            border: 1px solid #D8DCE4;
            }
            .box_table th,
            .box_table td {
            height: 30px;
            min-width: 60px;
            padding: 0 6px;
            text-align: center;
            }
            .box_table td {
                color: #777;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #ddd;
            }
            .box_table th {
                background: #F7F8FC;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #ddd;
            }
    </style>


`
