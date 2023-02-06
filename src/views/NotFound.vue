<template>
    <div class="panel panel-danger col-xs-12" >
        <div id="NotFoundBox" >
            <div class="NotFoundImg" >
                <img class="NotFoundPic" src="../assets/images/404.png" alt="页面不存在">
            </div>
            <div class="panel-body">
                尊敬的用户：&nbsp;&nbsp;您访问的页面不存在，请确认输入是否正确，或者向系统管理员反馈。
                <a class="NotFoundBack" href="javascript:history.back(-1);">返 回</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
    name: "NotFound",

    }
    
</script>

<style lang="scss" scoped>
        .panel-danger {
            position: relative;
            width: 100%;
            height: 100%;
        }
         #NotFoundBox {
            transform: translateY(10%);
            position: relative;
        }
        .panel-heading {
            display: none;
            position: absolute;
            left: 50%;
            top: 30%;
            transform: translateX(-50%);
            margin: 0 auto;
            z-index: -1;
        }
        
        .panel-title {
            margin: 0 10px;
            font-size: 30px;
            margin: 0 auto;
            color: rgba(118, 143, 158, .8);
            z-index: -1;
        }
        
        .panel-body {
            text-align: center;
            position: absolute;
            width: 460px;
            max-width: 100%;
            margin: 0 auto;
            margin: 5px 10px;
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            color: rgb(117, 117, 117);
            display: flex;
            flex-direction: column;
            margin-top: 30px;
            align-items: center;
        }
        
        .NotFoundImg {
            margin: 0 auto;
            z-index: 1;
        }
        
        .NotFoundPic {
            height: 340px;
            width: 340px;
            display: block;
            margin: auto auto;
        }
        
        .NotFoundBack {
            z-index: 99;
            margin-top: 30px;
            // align-self: center;
            display: block;
            width: 180px;
            background: linear-gradient(45deg, #2a7bff, #008dfee6,#2a7bff);
            color: rgb(255, 255, 255);
            border-radius: 10px;
            text-align: center;
            line-height: 35px;
            max-height: 90%;
            &:hover{
                background: rgba(21, 134, 240, 0.479);
            }
        }
        
         .NotFoundBack:active {
            color: rgb(94, 15, 15);
            background-color: rgb(115, 136, 172);
        }
</style>
