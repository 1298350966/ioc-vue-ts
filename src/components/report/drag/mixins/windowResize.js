export default {
    data() {
        return {
            timer:true
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler)
    },
    methods: {
        resizeHandler(){
            if(this.timer){
                this.timer = false
                setTimeout(() => {
                    // this.init()
                    this.$emit('onResize',this.init);
                    this.timer = true
                }, 1000);
            }
            
        },
    },
}