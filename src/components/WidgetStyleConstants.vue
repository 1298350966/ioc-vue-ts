<template>
    <section>
    </section>
</template>

<script>
    const imgWidgetStyle =  {
        mainTitleVisiable: true,
        mainTitleColor: null,
        mainTitle: "图片控件",
        fit: 'fill'
    };
    const queryWidgetStyle = {
        mainTitleVisiable: true,
        mainTitleColor: null,
        mainTitle: "",
        widgetType: 0,//0控件水平摆放 1：垂直摆放
        titleType: 0,//字段标签 0：上方 1：左边
        titleColor: null,
        titleFontSize: '14px',
        widgetStyle: {
            backgroundColor: null,
            fontColor: null,
            iconColor: null,
            borderSize: '1px',
            borderColor: null,
        }
    };
    const textWidgetStyle={
        mainTitleVisiable: true,
        mainTitleColor: null,
        mainTitle: "文本控件",
        backgroundColor: '#ffffff'
    };
    const innerPageWidgetStyle={
        mainTitleVisiable: true,
        mainTitleColor: null,
        mainTitle: "内嵌页面控件",
    };
    const tabPageWidgetStyle= {
        tabPosition: "top",
        tabType: "",
    };
    const kanbanWidgetStyle =  {
        mainTitleVisiable: true,
        mainTitle: '指标看板',
        mainTitleColor: 'rgba(0, 0, 0, 1)',
        titleRemark: '',
        subtitleVisible: false,
        subtitleText: '',
        subtitleUrl: '',
        maxPerLineBlock: 4,
        fontSetVisible: false,
        classLabelSize: '12px',
        classLabelColor: 'rgba(0, 0, 0, 1)',
        mainLabelSize: '12px',
        mainLabelColor: 'rgba(0, 0, 0, 0.5)',
        mainValueSize: '24px',
        mainValueColor: "rgba(0, 0, 0, 1)",
        viceLabelSize: '12px',
        viceLabelColor: 'rgba(0, 0, 0, 0.5)',
        viceValueSize: '12px',
        viceValueColor: 'rgba(0, 0, 0, 1)',
        borderStyle: 'solid',
        borderColor: 'rgb(232, 232, 232)',
        borderWidth: '2px',
        dataUnit: [],
        backgroundColor: 'rgb(255, 255, 255)',
        kanbanPosition: 1,
        gapSize: '5px',
        kanbanStyle: 0,
        fillColor: 'rgb(255, 255, 255)'
    }
   const formTableWidgetStyle ={
       mainTitleVisiable: true,
       mainTitleColor: null,
       mainTitle: "",
       pagination: true,//显示分页
       pageSize: 10,
       showSerialNum: true,
       backgroundColor: "#FFFFFF",
       tableHeaderStyle: {
           cellColor: null,
           cellFontSize: '14px',
           cellPosition: 'center',
           cellBorderColor: '#EBEEF5',
           backgroundColor: null,
           cellHeight: '50'
       },
       tableBodyStyle: {
           cellColor: null,
           cellFontSize: '12px',
           cellPosition: 'center',
           cellBorderColor: '#EBEEF5',
           backgroundColor: '#FFFFFF',
           backgroundColorHover: '#F5F7FA',
           cellHeight: '40',
           optFontSize: '12px',
           optColor: null

       },
       tableBorderStyle: {
           boderSize: '1px',
           boderColor: '#EBEEF5',
           btnBgColor: null,
           btnFontColor: null,
       },
       tablePaginationStyle: {
           fontColor: null,
           buttonStyle: {
               backgroundColor: null,
               fontColor: null,
           },
           buttonActiveStyle: {
               backgroundColor: null,
               fontColor: null,
           },
           inputStyle: {
               backgroundColor: null,
               fontColor: null,
               borderWidth: '1px',
               borderColor: null
           }
       }
   };
   const reportTableWidgetStyle = {
       mainTitleVisiable: true,
       mainTitleColor: null,
       mainTitle: "交叉表",
       pagination: true,//显示分页
       pageSize: 100,
       showSerialNum: true,
       backgroundColor: "#FFFFFF",
       tableHeaderStyle: {
           cellColor: null,
           cellFontSize: '14px',
           cellPosition: 'center',
           cellBorderColor: '#EBEEF5',
           backgroundColor: null,
           cellHeight: '50'
       },
       tableBodyStyle:{
           cellColor:null,
           cellFontSize:'12px',
           cellPosition:'left',
           cellBorderColor:'#EBEEF5',
           backgroundColor:'#FFFFFF',
           backgroundColorHover: '#F5F7FA',
           cellHeight:'40'

       },
       drillingNavigationStyle:{
           fontSize:'14px',
           fontColor:null,
           iconColor:null
       },
       tableBorderStyle:{
           boderSize:'1px',
           boderColor: '#EBEEF5',
       },
       tablePaginationStyle:{
           fontColor:null,
           buttonStyle:{
               backgroundColor:null,
               fontColor:null,
           },
           buttonActiveStyle:{
               backgroundColor:null,
               fontColor:null,
           },
           inputStyle:{
               backgroundColor:null,
               fontColor:null,
               borderWidth:'1px',
               borderColor:null
           }
       }
   };

    export default {
        imgWidgetStyle,
        queryWidgetStyle,
        textWidgetStyle,
        innerPageWidgetStyle,
        tabPageWidgetStyle,
        formTableWidgetStyle,
        reportTableWidgetStyle,
        kanbanWidgetStyle
    }
</script>
