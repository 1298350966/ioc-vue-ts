import { lte } from "semver";

export const createMap =  function(dom,options){
    let MapOptions = {}
    return new T.Map(dom,Object.assign(MapOptions,options));
} 


export const Marker =  function(lnglat,options){
    let MarkerOptions = {}
    return new T.Marker(lnglat,Object.assign(MarkerOptions,options));
} 

export const Circle =  function(center,radius,options){
    let opts = {}
    return new T.Circle(center,radius,Object.assign(opts,options));
} 
export const LngLat =  function(lng, lat){
    return new T.LngLat( lng, lat );
} 

class TGis{
    constructor(dom,options){
       this.map = createMap(dom,options)
       this.geocoder = new T.Geocoder();
    }
}
TGis.prototype.LngLat = LngLat
/* 初始化定位地图。
lnglat：地图的中心点地理坐标。
zoom：地图的比例尺级别。 */
TGis.prototype.centerAndZoom = function(lnglat,zoom){
    this.map.centerAndZoom(lnglat,zoom)
}
//根据提供的坐标点数组设置地图视野，调整后的视野会保证包含提供的坐标点。
TGis.prototype.setViewport = function(view){
    this.map.setViewport(view)
}

TGis.prototype.panTo = function(lnglat,zoom = 16){
    this.map.panTo(lnglat, zoom);
}



TGis.prototype.addMarker = function(lnglat,options,labelOptions){
    var marker = Marker(lnglat,options)
    this.map.addOverLay(marker);
    if(labelOptions){
        let label = new T.Label({
            text: labelOptions.text,
            position: marker.getLngLat(),
            offset: new T.Point(labelOptions.offset[0],labelOptions.offset[1])
        });
        this.map.addOverLay(label);
    }
    return marker
}

TGis.prototype.addPolyline = function(points,PolylineOptions){
    var polyline = new T.Polyline(points,PolylineOptions)
    this.map.addOverLay(polyline);
    return polyline
}

TGis.prototype.addCircle = function(center,radius,options){
    var circle = Circle(center,radius,options);
    this.map.addOverLay(circle);
    return circle
}


TGis.prototype.mapClick = function(searchResult){
    this.map.addEventListener("click", function(e){
        this.getLocation(e.lnglat,searchResult)
    }.bind(this));
}

TGis.prototype.getLocation = function(lnglat,searchResult){
    this.geocoder.getLocation(lnglat,searchResult);
}
TGis.prototype.getPoint = function(value, searchResult){
    this.geocoder.getPoint(value, searchResult);
}


export default TGis