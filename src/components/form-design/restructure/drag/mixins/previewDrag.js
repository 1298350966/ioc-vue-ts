export default {
    props: {
        yourList: {
            required: true,
            type: Array
        }, //当前容器的控件集合
        chartVueStyle:{
            type: Object,
            default:function(){
                return {}
            }
        },
    },
    data() {
        return {
            baseWidth:100,
            baseHeight:100,
            baseMarginLeft:5,
            baseMarginTop:5,
        };
    },
    computed:{
        style(){
            this.chartVueStyle.height = this.dragHeight
            return this.chartVueStyle
        },
        dragHeight(){
            let cellHeight = this.baseHeight;  // 设置单元格基础的高度
            let height = this.yourList.reduce(function (num1,obj){ 
                let num2 = obj.y + obj.sizey
                return Math.max(num1, num2) }, 0) 
    
            return cellHeight * height  + "px"
        },
    },
    watch:{
        yourList(){
            this.initGrid()
        }
    },
    mounted() {
        this.initGrid()
    },
    methods: {
        initGrid() { 
            this.$nextTick(()=>{
                if(this.$el){
                    let screenWidth = this.$el ? this.$el.clientWidth : "";
                    if(this.version == 1){
                        this.baseWidth = 5 * (screenWidth / 1366);
                        this.baseHeight = 14.5;
                        this.baseMarginLeft = 5 * (screenWidth / 1366);
                        this.baseMarginTop = this.$attrs.baseMarginTop ? this.$attrs.baseMarginTop : 5 ; 
                    }else{
                        this.baseWidth = 7;
                        this.baseHeight = 5 + (this.$attrs.baseMarginTop ? this.$attrs.baseMarginTop : 5);
                        this.baseMarginLeft = 5 * (screenWidth / 1366);
                        this.baseMarginTop = this.$attrs.baseMarginTop ? this.$attrs.baseMarginTop : 5 ;  
                    }
                }
            });
        },
        ItemStyle(){
            this.$nextTick(()=>{
                this.yourList.forEach(item => {
                    this.$set(item,"style",this.nowItemStyle(item))  
                    console.log(this.nowItemStyle(item))
                })
            })
        }, 
        nowItemStyle(item, index){
            if(item.ItemStyle){
                return item.ItemStyle
            }else{
                try {
                    if(this.version == 1){
                        let clientWidth = this.$el ?  this.$el.clientWidth : ""
                        let cellWidth = this.baseWidth + this.baseMarginLeft;   // 设置单元格基础的宽度
                        let cellHeight = this.baseHeight;  // 设置单元格基础的高度
                        return {
                            position: "absolute",
                            width: ((cellWidth * (item.sizex) - this.baseMarginLeft) / clientWidth * 100).toFixed(4)  + '%',
                            height: (cellHeight * (item.sizey) - this.baseMarginTop) + 'px',
                            left: ((cellWidth * (item.x - 1) + this.baseMarginLeft) / clientWidth * 100).toFixed(4)  + '%',
                            top: (cellHeight * (item.y - 1) + this.baseMarginTop) + 'px',
                        }
                    }else{
                        let clientWidth = this.$el ?  this.$el.clientWidth : ""
                        let cellWidth = this.baseWidth + this.baseMarginLeft;   // 设置单元格基础的宽度
                        let cellHeight = this.baseHeight ;  // 设置单元格基础的高度
                        let maxCell = Math.round(clientWidth / cellWidth) 
                        return {
                            position: "absolute",
                            width: ((cellWidth * (item.sizex) * (maxCell / item.designMaxCell) - this.baseMarginLeft) / clientWidth * 100).toFixed(4)  + '%',
                            height: (cellHeight * (item.sizey) - this.baseMarginTop)  + 'px',
                            left: ((cellWidth * (item.x - 1) * (maxCell / item.designMaxCell) + this.baseMarginLeft) / clientWidth * 100).toFixed(4)  + '%',
                            top: (cellHeight * (item.y - 1) * (maxCell / item.designMaxCell) + this.baseMarginTop) + 'px',
                        }
                    }
                    
                } catch (error) {
                    return {}
                } 
            }
        }
    }
}