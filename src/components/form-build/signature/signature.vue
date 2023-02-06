<template>
  <div class="signHandle">
    <div class="signHandle-content">
    <canvas id='canvas'  ref="signHandle" class="canvas" />
    <div class="btn_container van-hairline--top" >
        <el-radio-group v-model="radio " @change="radioHandle">
            <el-radio v-for="item in liColors" :key="item.color"  :label="item.color">{{item.name}}</el-radio>

        </el-radio-group>

      <div class="button-box">
        <el-button size="small" @click="clearHandle">清空</el-button>
        <el-button type="primary" size="small"  @click="saveImg">确认</el-button>
      </div>
    </div>
    </div>
    
  </div>


</template>

<script>
// let { clientWidth, clientHeight } = document.documentElement
let clientWidth,clientHeight
import axios from "axios";
let resize
export default {
  
  name:'signature',
  // props:{
  //   fileId:{
  //     type:String,
  //     default:''
  //   }
  // },
  data() {
    return {
      radio: '#000',
      height: 0,
      direction: false, // true 代表横屏, false 代表'竖屏'
      canvas: '', // canvas dom
      ctx: '', // canvas context
      background: '#fff', // canvas background-color
      color: '#000', // 绘制时线条的颜色
      linewidth: 3, // 线条的宽度
       liColors: [
        {name: '红色',color:'#ee0a24'},
        {name: '黑色',color:'#000'},
        {name: '蓝色',color:'#1890ff'},
        ],

      imgBase64:"",
      moving:false,
    }
  },
  created() {     
    this.color = this.radio
    window.addEventListener(
      'onorientationchange' in window ? 'orientationchange' : 'resize',
      () => {
        if (window.orientation === 180 || window.orientation === 0) {
          this.direction = false
          this.draw()
        }
        if (window.orientation === 90 || window.orientation === -90) {
          this.direction = true
          this.draw()
        }
      },
      false
    )
  },
  mounted() {
     this.draw()
     window.addEventListener("resize", this.draw)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.draw)
  },
  methods: {
    radioHandle(value) {
      this.color = value
      this.setCanvas()
    },
    // 添加绘制 line
    draw() {
      clientWidth =this.$refs.signHandle.clientWidth
      clientHeight= this.$refs.signHandle.clientHeight
      this.$nextTick(()=>{
        this.canvas = this.$refs.signHandle
        this.initCanvas()
      });
    },
    // 初始化canvas配置
    initCanvas() {
      const { height, direction, canvas } = this
      console.log(clientHeight)
      if (direction) {
        canvas.width = clientHeight
        canvas.height = clientWidth - height
      } else {
        canvas.width = clientWidth
        canvas.height = clientHeight - height
      }
      this.ctx = canvas.getContext('2d')
      this.setCanvas()
      this.bindEvent()
    },
    // 配置 canvas
    setCanvas() {
      const { ctx, height, direction } = this
      // 设置背景色
      ctx.fillStyle = this.background
      console.log(this.background);
      // 绘制矩形
      if (direction) {
        ctx.fillRect(0, 0, clientHeight, clientWidth - height)
      } else {
        ctx.fillRect(0, 0, clientWidth, clientHeight - height)
      }
 
      // 设置线条颜色
      ctx.strokeStyle = this.color
      // 设置线宽
      ctx.lineWidth = this.linewidth
      // 设置线条两头的结束点和开始点是圆形的
      ctx.lineCap = 'round'
    },
    // // // 开始绘制
    // drawStart() {
    //   const { canvas, ctx } = this
    //   canvas.addEventListener(
    //     'mousedown',
    //     e => {
    //          this.moving = true;
    //     //   console.log(e)
    //       ctx.beginPath()
    //       ctx.moveTo(e.offsetX, e.offsetY )
         
    //     },
    //     false
    //   )
    // },
    // // 绘制中
    // drawing() {
    //   const { canvas, ctx } = this
      
    //   canvas.addEventListener(
    //     'mousemove',
    //     e => {
    //         if(this.moving) {
                
    //             ctx.lineTo(e.offsetX, e.offsetY)
    //             ctx.stroke()
    //         }
    //     },
    //     false
    //   )
    // },
    // // 绘制结束
    // drawEnd() {
    //   const { canvas, ctx } = this
    //   canvas.addEventListener('mouseup', () => {ctx.closePath()
    //     this.moving = false;
    //   }, false)
    // },
    // 开始绘制
    drawStart({x,y}) {
      this.moving = true;
      this.ctx.beginPath();
      this.ctx.moveTo(
        x,
        y
      );
   },
    // 绘制中
    drawing({x,y}) {
      if(this.moving){
        this.ctx.lineTo(
          x,
          y
        );
        this.ctx.stroke();
      }
    },
    // 绘制结束
    drawEnd() {
      this.ctx.closePath();
      this.moving = false;
    },
    // 绑定事件
    bindEvent () {
        //鼠标按下 => 下笔
        this.canvas.addEventListener('mousedown', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            this.drawStart({ x: e.offsetX || e.clientX, y: e.offsetY || e.clientY })
        });
        //书写过程 => 下笔书写
        this.canvas.addEventListener('mousemove', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            this.drawing({ x: e.offsetX, y: e.offsetY });
        });
        //鼠标松开 => 提笔
        this.canvas.addEventListener('mouseup', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            this.drawEnd()
        });
        //离开书写区域 => 提笔离开
        this.canvas.addEventListener('mouscanvaseave', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            this.drawEnd()
        });
        /* ==========================移动端兼容=Start================================ */
        //手指按下 => 下笔
        this.canvas.addEventListener('touchstart', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            const touch = e.targetTouches[0];
            // 这个是为了解决移动端手指落点偏移问题
            const {x,y,width,height} = this.canvas.getBoundingClientRect()
            if(this.direction){
              var point = { x:touch.clientY - y, y:width - (touch.clientX - x) }
            }else{
              var point = { x: touch.clientX - x, y: touch.clientY - y }
            }
            this.drawStart(point);

        
        });
        //手指移动 => 下笔书写
        this.canvas.addEventListener('touchmove', (e) => {
            e && e.preventDefault() && e.stopPropagation();
            const touch = e.targetTouches[0];
            const {x,y,width,height} = this.canvas.getBoundingClientRect()
            if(this.direction){
              var point = { x:touch.clientY - y, y:width - (touch.clientX - x) }
            }else{
              var point = { x: touch.clientX - x, y: touch.clientY - y }
            }
            this.drawing(point);
        });
        //手指移动结束 => 提笔离开
        this.canvas.addEventListener('touchend', (e) => {
              e && e.preventDefault() && e.stopPropagation();
            const tcs = e.targetTouches;
            const ccs = e.changedTouches;
            const touch = (tcs && tcs.length && tcs[0]) || (ccs && ccs.length && ccs[0]);
            const {x,y,width,height} = this.canvas.getBoundingClientRect()
            
            if(this.direction){
              var point = { x:touch.clientY - y, y:width - (touch.clientX - x) }
            }else{
              var point = { x: touch.clientX - x, y: touch.clientY - y }
            }
            this.drawEnd(point)
        });
    },
    // 清空
    clearHandle() {
      this.initCanvas()
    },
    // 保存信息
    saveImg() {
       this.imgBase64 = this.canvas.toDataURL("image/png")
       let blob = this.dataUrlToBlob(this.imgBase64);
      this.uploadFile(blob);
      
    },

    // 将base64转成图片文件流
    dataUrlToBlob(dataUrl) {
      let arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        // arr[0]是data:image/png;base64
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      let imgFile = new Blob([u8arr], {
        type: mime
      });
      return imgFile;
    },

    // 上传二进制文件
    async uploadFile(blob) {
      const formData = new FormData();
      formData.append("image", blob);

      const res  = await axios({
        method: "post",
        url: "/api/file/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        this.$emit('onFileId',res.data.datas[0].fileId)
    }
  }
  
}

</script>

<style lang="scss" scope>

.signHandle {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-color: #666;
    // padding-top: 46px;
    box-sizing: border-box;
  .signHandle-content{
   height:calc(100% - 43px) ;
 .image{
      position: absolute;
      top: 46px;
      left: 0;
      z-index: 3;
  }
  .canvas {
    height: 100%;
    width: 100%;
  }
  .btn_container {
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 5px 15px;
    box-sizing: border-box;
    justify-content: space-between;
    border-top:1px solid rgb(209, 209, 209) ;
    .radio_container {
      display: flex;
       .van-radio {
        margin-right: 5px;
        &:nth-child(1) {
          ::v-deep .van-icon {
            background-color: #ee0a24;
          }
        }
        &:nth-child(2) {
          ::v-deep .van-icon {
            background-color: #000;
          }
        }
        &:nth-child(3) {
          ::v-deep .van-icon {
            background-color: #1890ff;
          }
        }
      }
    }
    .button-box{
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  }
  }
 
}
</style>
