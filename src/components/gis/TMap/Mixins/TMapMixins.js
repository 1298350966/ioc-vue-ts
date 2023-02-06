import TGis from "../Class/TGis";
import {LngLat} from "../Class/TGis";
let tGis = null
export default {
    name: "GaoDeGis",
    // fromParentGisObj: 地图编辑状态时,从父表单传递过来的对象
    // gisInitObj: 初始化地图的参数
    // childResp: 定位完成后,返回给父表单的对象
    props: ['fromParentGisObj', 'gisInitObj', 'childResp'],
    watch: {
        childResp() {
            this.$emit("recGisMsg", this.retGisObj);
        },
        "retGisObj.lat"(){
            this.addressMarker.setLngLat(LngLat(this.retGisObj.lnt, this.retGisObj.lat));
            if(this.retGisObj.positionScope){
                this.rangeCircle.setCenter(LngLat(this.retGisObj.lnt, this.retGisObj.lat))
            }
        },
        "retGisObj.positionScope"(newVl){
            if(this.rangeCircle){
                this.rangeCircle.setRadius(newVl) 
            }
        }
    },
    
    data() {
        return {
            GdMap: null, // 地图实例
            loading: true,
            retGisObjRules: {
                /*             lat: [
                                 {required: true, message: '请输入经度', trigger: 'blur'},
                             ],
                             lnt: [
                                 {required: true, message: '请输入纬度', trigger: 'blur'},
                             ]*/
            },
            retGisObj: {
                lat: null,       // 纬度
                lnt: null,       // 经度
                address: ""      // 地址
            },

            gisCenter: [],
            mapObj: {},
            poiArr: [],
            marker: [],
     
            // 信息窗口的数组
            windowsArr: [],
            // 默认初始化的城市
            city: '010',
            addressMarker:null,
            rangeCircle:null
        }
    },
    mounted() {
        this.loading = false;


                if (!this.KHUtils.isNull(this.fromParentGisObj.lnt) && !this.KHUtils.isNull(this.fromParentGisObj.lat)) {
                    this.retGisObj = this.fromParentGisObj;
                }
                //定位范围配置，启用定位功能时生效
                if (!this.KHUtils.isNull(this.fromParentGisObj.positionScope)) {
                    this.retGisObj.positionScope = this.fromParentGisObj.positionScope;
                }
                // 如果表单设计时已经设置了中心点位置经纬度,缩放级别则使用用户设置的,否则默认
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitLng) && !this.KHUtils.isNull(this.gisInitObj.gisInitLat)) {
                    this.khConfig.host.gisInitLng = this.gisInitObj.gisInitLng;
                    this.khConfig.host.gisInitLat = this.gisInitObj.gisInitLat;
                }
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitZoom)) {
                    this.khConfig.host.gisInitZoom = this.gisInitObj.gisInitZoom;
                }
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitCity)) {
                    this.city = this.gisInitObj.gisInitCity;
                }
                this.initMap();
                console.log('地图加载成功！');
    },
    methods: {
        // 初始化地图
        initMap() {
            let _this = this;
            let flag = false;
            if (_this.retGisObj.lnt === null || _this.retGisObj.lat === null) {
                _this.gisCenter = LngLat(_this.khConfig.host.gisInitLng, _this.khConfig.host.gisInitLat);
            } else {
                flag = true;
                _this.gisCenter = LngLat(_this.retGisObj.lnt, _this.retGisObj.lat);
            }

            tGis = new TGis("gisMap",{
                zoom: this.khConfig.host.gisInitZoom,
                center: this.gisCenter
                // center:LngLat(116.40969, 39.89945)
            })
            // tGis.map.centerAndZoom(new T.LngLat(116.40969, 39.89945), this.khConfig.host.gisInitZoom);
            this.addressMarker = tGis.addMarker(this.gisCenter)

            if(this.retGisObj.positionScope){
                // 构造矢量圆形
                this.rangeCircle = tGis.addCircle(LngLat(_this.retGisObj.lnt, _this.retGisObj.lat),this.retGisObj.positionScope,{
                    color:"#F33",
                    weight:3,
                    opacity:1,
                    fillColor:"#ee2200",
                    fillOpacity: 0.35,
                    lineStyle:"solid"
                })
            }
         
            tGis.setViewport(LngLat(_this.retGisObj.lnt, _this.retGisObj.lat))

            // tGis.map.setViewport([new T.LngLat(_this.retGisObj.lnt, _this.retGisObj.lat)])
            // this.mapObj.setFitView();
            if (flag) {
                // 输入经纬度定位
                this.addressMarker.setLngLat(LngLat(_this.retGisObj.lnt, _this.retGisObj.lat));
                // 根据经纬度获取地址
                this.getAddressByLntLat(_this.retGisObj.lnt, _this.retGisObj.lat);
            }
            tGis.mapClick(this.locationResult)
        },
        // 定位
        poi() {
            
        },
        // 经纬度转化为详细地址
        getAddressByLntLat(lnt, lat) {
            tGis.getLocation(LngLat(lnt, lat),this.locationResult)
        },
        // 地址回调
        locationResult(result){
            const _this = this
            if(result.getStatus() == 0){
                let lnglat = result.getLocationPoint()
                _this.retGisObj.lnt = lnglat.getLng();
                _this.retGisObj.lat = lnglat.getLat();
                _this.retGisObj.address = result.getAddress()
            }else{
                _this.$notify({
                    title: '错误',
                    message: '无法获取地址',
                    type: 'error'
                });
                console.log('服务器返回状态:'+ result.getStatus())
                console.log('服务器返回响应信息:'+ result.getMsg())
            }
        },
        // 根据名字地址去搜索结果
        placeSearch() {
            if(this.retGisObj.lnt && this.retGisObj.lat){
                let lnglat = LngLat(this.retGisObj.lnt, this.retGisObj.lat)
                tGis.panTo(lnglat, 16);
                tGis.getLocation(lnglat, this.locationResult)
            }else{
                tGis.getPoint(this.retGisObj.address,this.keywordSearchCallBack)
            }
            // let _this = this;
            // if (_this.KHUtils.isNull(this.retGisObj.address) && _this.KHUtils.isNull(this.retGisObj.lat) && _this.KHUtils.isNull(this.retGisObj.lnt)) {
            //     _this.poi();
            //     return false;
            // } else if (!_this.KHUtils.isNull(this.retGisObj.lat) && !_this.KHUtils.isNull(this.retGisObj.lnt)) {
            //     _this.poi();
            //     return false;
            // }
            // let MSearch;
            // _this.mapObj.clearMap();
            // _this.mapObj.plugin(
            //     ["AMap.PlaceSearch", "AMap.ToolBar", "AMap.Scale"],
            //     () => {
            //         this.mapObj.addControl(new AMap.ToolBar());
            //         this.mapObj.addControl(new AMap.Scale());
            //         MSearch = new AMap.PlaceSearch({
            //             // 城市，默认：“全国”
            //             city: _this.city
            //         });
            //         // 返回地点查询结果
            //         this.GdMap.event.addListener(MSearch, "complete", this.keywordSearchCallBack);
            //         // 关键字查询
            //         MSearch.search(_this.retGisObj.address);
            //     }
            // );
        },
        //搜索结果的回调
        keywordSearchCallBack(result) {
            if(result.getStatus() == 0){
                let lnglat = result.getLocationPoint()
                // _this.retGisObj.lnt = lnglat.getLng();
                // _this.retGisObj.lat = lnglat.getLat();
                // _this.retGisObj.address = result.getAddress()
                tGis.panTo(lnglat, 16);
            }else{
                alert(result.getMsg());
            }
            // console.log(data);
            // let poiArr = data.poiList.pois;
            // let resultCount = poiArr.length;
            // this.poiArr = poiArr; //左边要渲染的数据
            // for (var i = 0; i < resultCount; i++) {
            //     this.addMarker(i, poiArr[i]);
            //     this.poiArr[i].url = this.poiArr[i].photos ? this.poiArr[i].photos[0] ? this.poiArr[i].photos[0].url : "" : "";
            // }
            this.mapObj.setFitView();
        },
        addMarker(i, d) {
            let lngX = d.location.getLng();
            let latY = d.location.getLat();
            let markerOption = {
                map: this.mapObj,
                position: new AMap.LngLat(lngX, latY)
            };
            let mar = new AMap.Marker(markerOption);
            this.marker.push(new AMap.LngLat(lngX, latY));
            let infoWindow = new AMap.InfoWindow({
                content: "<h3>" + d.name + "</h3>" + this.TipContents(d.name, d.address),
                size: new AMap.Size(300, 0),
                autoMove: true,
                offset: new AMap.Pixel(0, -30)
            });
            this.windowsArr.push(infoWindow);
            let _this = this;
            var aa = (e) => {
                var obj = mar.getPosition();
                this.map = obj; //这里保存的地址经纬度
                this.retGisObj.address = d.address;
                this.retGisObj.lat = obj.lat;
                this.retGisObj.lnt = obj.lng;
                this.address = d.name + d.address;//这里保存的是地址名字
                infoWindow.open(_this.mapObj, obj);
            };
            this.GdMap.event.addListener(mar, "click", aa)
        },
        /**
         * @return {string}
         */
        TipContents(name, address) {
            //窗体内容
            if (
                name === "" ||
                name === "undefined" ||
                name === null ||
                name === " undefined" ||
                typeof name == "undefined"
            ) {
                type = "暂无";
            }
            if (
                address === "" ||
                address === "undefined" ||
                address === null ||
                address === " undefined" ||
                typeof address === "undefined"
            ) {
                address = "暂无";
            }
            return `地址：${address}`;
        }
    },
}