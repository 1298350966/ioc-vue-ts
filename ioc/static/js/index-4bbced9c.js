import{S as h}from"./index.esm.min-0a61ff36.js";import{a1 as d,aB as g,aC as C}from"./index-55ccac47.js";import{an as n}from"./index-4e626338.js";import{u as v}from"./useChartDataFetch.hook-495a5af9.js";import{i as x}from"./axios-ba46900f.js";import{u as y,a as _,U as b}from"./echarts-676dbcd6.js";import"./lodash-f91682a1.js";import{u as q}from"./useAddEvent.kooks-e46e3810.js";import{d as A,r as O,g as S,f as j,o as k,s as B,u}from"./vue-65382a1b.js";import"./vueRepl-a238c739.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./xgplayerVue-c27b6911.js";import"./http-0d114cdb.js";import"./axios-e76ab20a.js";import"./useEvent.hook-afeb4a8c.js";const N=A({__name:"index",props:{themeSetting:{type:Object,required:!0},themeColor:{type:Object,required:!0},chartConfig:{type:Object,required:!0}},setup(s){const t=s,{rootConfig:c,getEvents:D}=q(t.chartConfig,g);y([_,b]);const m=O(),f=S(()=>(i(n(t.chartConfig.data)),d(t.chartConfig.option,t.themeSetting,C))),i=e=>{var r;let{classAxis:a,valueAxis:o}=t.chartConfig.dataMapping;e&&(t.chartConfig.option.series[0].data=p(e,a[0].column,o[0].column),(r=m.value)==null||r.setOption(t.chartConfig.option))};function p(e,a,o){return e.map(r=>{let l=r.children&&p(r.children,a,o);return{name:r[a],value:r[o],children:l||null}})}return j(()=>t.chartConfig.data,e=>{i(n(e))},{deep:!1,immediate:!0}),v(t.chartConfig,c.requestGlobalConfig,e=>{i(n(e))}),(e,a)=>(k(),B(u(h),{ref_key:"vChartRef",ref:m,theme:s.themeColor,option:f.value,"manual-update":u(x)(),autoresize:""},null,8,["theme","option","manual-update"]))}});export{N as default};