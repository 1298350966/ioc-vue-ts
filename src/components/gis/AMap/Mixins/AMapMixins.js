import {mapConfig} from "@/config"
export default {
    name: "GaoDeGis",
    // fromParentGisObj: 地图编辑状态时,从父表单传递过来的对象
    // gisInitObj: 初始化地图的参数
    // childResp: 定位完成后,返回给父表单的对象
    props: ['fromParentGisObj', 'gisInitObj', 'childResp'],
    watch: {
        childResp() {
            this.$emit("recGisMsg", this.retGisObj);
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
            city: '010'
        }
    },
    mounted() {
        let key = mapConfig.gisKey;
        if (this.KHUtils.isNull(key)) {
            this.$notify({
                title: '错误',
                message: '请在kh.config.json文件中配置高德地图的开发者Key',
                type: 'error'
            });
            return false;
        }
        let v = mapConfig.gisVersion;
        v = this.KHUtils.isNull(v) ? '1.4.15' : v;
        loadMap(key, this.plugins, v)
            .then(AMap => {
                if (AMap !== null && AMap !== undefined) {
                    this.loading = false;
                }
                // 此处地图就加载成功了，然后就可以使用`new AMap.Map`来实例化地图了
                this.GdMap = AMap;
                if (!this.KHUtils.isNull(this.fromParentGisObj.lnt) && !this.KHUtils.isNull(this.fromParentGisObj.lat)) {
                    this.retGisObj = this.fromParentGisObj;
                }
                //定位范围配置，启用定位功能时生效
                if (!this.KHUtils.isNull(this.fromParentGisObj.positionScope)) {
                    this.retGisObj.positionScope = this.fromParentGisObj.positionScope;
                }
                // 如果表单设计时已经设置了中心点位置经纬度,缩放级别则使用用户设置的,否则默认
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitLng) && !this.KHUtils.isNull(this.gisInitObj.gisInitLat)) {
                    mapConfig.gisInitLng = this.gisInitObj.gisInitLng;
                    mapConfig.gisInitLat = this.gisInitObj.gisInitLat;
                }
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitZoom)) {
                    mapConfig.gisInitZoom = this.gisInitObj.gisInitZoom;
                }
                if (!this.KHUtils.isNull(this.gisInitObj.gisInitCity)) {
                    this.city = this.gisInitObj.gisInitCity;
                }
                this.initMap();
                console.log('地图加载成功！');
            }).catch(() => {
            this.$notify({
                title: '错误',
                message: '地图加载失败,请检查网络',
                type: 'error'
            });
            this.loading = false;
            return false;
        });
    },
    methods: {
        // 初始化地图
        initMap() {
            let _this = this;
            let flag = false;
            if (_this.retGisObj.lnt === null || _this.retGisObj.lat === null) {
                _this.gisCenter = [mapConfig.gisInitLng, mapConfig.gisInitLat];
            } else {
                flag = true;
                _this.gisCenter = [_this.retGisObj.lnt, _this.retGisObj.lat];
            }
            _this.mapObj = new AMap.Map("gisMap", {
                resizeEnable: true,
                zoom: mapConfig.gisInitZoom,
                center: _this.gisCenter,
                keyboardEnable: false
            });
      
            // _this.mapObj = new AMap.Map("gisMap", {
            //     resizeEnable: true,
            //     view: new AMap.View2D({
            //         resizeEnable: true,
            //         zoom: mapConfig.gisInitZoom,
            //         center: _this.gisCenter
            //     }),
            //     keyboardEnable: false
            // });
            let marker = new AMap.Marker({
                map: _this.mapObj,
                bubble: true
            });
            if(this.retGisObj.positionScope){
                // 构造矢量圆形
                var circle = new AMap.Circle({
                    center: new AMap.LngLat(_this.retGisObj.lnt, _this.retGisObj.lat), // 圆心位置
                    radius: this.retGisObj.positionScope,  //半径
                    strokeColor: "#F33",  //线颜色
                    strokeOpacity: 1,  //线透明度
                    strokeWeight: 3,  //线粗细度
                    fillColor: "#ee2200",  //填充颜色
                    fillOpacity: 0.35 //填充透明度
                });
                _this.mapObj.add(circle);
                _this.mapObj.setFitView();
            }
            if (flag) {
                // 输入经纬度定位
                marker.setPosition([_this.retGisObj.lnt, _this.retGisObj.lat]);
                // 根据经纬度获取地址
                this.getAddressByLntLat(_this.retGisObj.lnt, _this.retGisObj.lat);
            }
            this.GdMap.event.addListener(_this.mapObj, 'click', function (e) {
                _this.retGisObj.lnt = e.lnglat.getLng();
                _this.retGisObj.lat = e.lnglat.getLat();
                marker.setPosition([_this.retGisObj.lnt, _this.retGisObj.lat]);
                AMap.plugin('AMap.Geocoder', function () {
                    var gd = new AMap.Geocoder({
                        // 城市，默认：“全国”
                        city: _this.city
                    });
                    gd.getAddress(e.lnglat, function (status, result) {
                        if (status === 'complete') {
                            _this.retGisObj.address = result.regeocode.formattedAddress;
                        } else {
                            _this.$notify({
                                title: '错误',
                                message: '无法获取地址',
                                type: 'error'
                            });
                            return false;
                        }
                    })
                })

            });
        },
        // 定位
        poi() {
            this.$refs.retGisObj.validate((valid) => {
                if (valid) {
                    this.initMap();
                }
            });
        },
        // 经纬度转化为详细地址
        getAddressByLntLat(lnt, lat) {
            let _this = this;
            this.GdMap.plugin('AMap.Geocoder', function () {
                let gd = new AMap.Geocoder({
                    radius: 100,
                    extensions: "all"
                });
                gd.getAddress([lnt, lat], function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        _this.retGisObj.address = result.regeocode.formattedAddress;
                    }
                });
            })
        },
        // 根据名字地址去搜索结果
        placeSearch() {
            let _this = this;
            if (_this.KHUtils.isNull(this.retGisObj.address) && _this.KHUtils.isNull(this.retGisObj.lat) && _this.KHUtils.isNull(this.retGisObj.lnt)) {
                _this.poi();
                return false;
            } else if (!_this.KHUtils.isNull(this.retGisObj.lat) && !_this.KHUtils.isNull(this.retGisObj.lnt)) {
                _this.poi();
                return false;
            }
            let MSearch;
            _this.mapObj.clearMap();
            _this.mapObj.plugin(
                ["AMap.PlaceSearch", "AMap.ToolBar", "AMap.Scale"],
                () => {
                    this.mapObj.addControl(new AMap.ToolBar());
                    this.mapObj.addControl(new AMap.Scale());
                    MSearch = new AMap.PlaceSearch({
                        // 城市，默认：“全国”
                        city: _this.city
                    });
                    // 返回地点查询结果
                    this.GdMap.event.addListener(MSearch, "complete", this.keywordSearchCallBack);
                    // 关键字查询
                    MSearch.search(_this.retGisObj.address);
                }
            );
        },
        //搜索结果的回调
        keywordSearchCallBack(data) {
            // console.log(data);
            let poiArr = data.poiList.pois;
            let resultCount = poiArr.length;
            this.poiArr = poiArr; //左边要渲染的数据
            for (var i = 0; i < resultCount; i++) {
                this.addMarker(i, poiArr[i]);
                this.poiArr[i].url = this.poiArr[i].photos ? this.poiArr[i].photos[0] ? this.poiArr[i].photos[0].url : "" : "";
            }
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