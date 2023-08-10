import { coverEnum } from "../type"
import { createCircleMarker, createMarker, createOverlayGroup, createPolygon, createPolyline } from "../utils"
// import { coverEnum, coverGroupOptions } from "../config";
export const useMarkerGroup = (config: any, map) => {
  const overlayGroup = createOverlayGroup(map)
  const { dataset, options } = config
  const createMarkerGroup = () => {
    overlayGroup.clearOverlays()
    unref(dataset).forEach(data => {
      let _key = ["position", "icon", 'title']
      // let _options = { ...options }
      Object.keys(data).forEach((key) => {
        if (_key.includes(key)) {
          options[key] = data[key]
        }
      })
      options.extData = data
      let M = createMarker(options)
      M && overlayGroup.addOverlay(M)
    })
  }

  // watch(() => config.dataset, (newVl, oldVl) => {
  //   if (config.type == coverEnum.Marker) {
  //     createMarkerGroup()
  //   }
  // })
  return {
    overlayGroup,
    createMarkerGroup
  }
}

export const useCircleMarkerGroup = (config: any, map) => {
  const overlayGroup = createOverlayGroup(map)
  const { dataset, options } = config
  const createCircleMarkerGroup = () => {
    console.log("createCircleMarkerGroup");
    overlayGroup.clearOverlays()
    unref(dataset).forEach(data => {
      let _key = ["center", "radius", 'strokeColor', 'strokeOpacity', 'strokeWeight', "fillColor", "fillOpacity"]
      // let _options = { ...options }
      Object.keys(data).forEach((key) => {
        if (_key.includes(key)) {
          options[key] = data[key]
        }
      })
      options.extData = data
      let circleMarker = createCircleMarker(options)

      circleMarker && overlayGroup.addOverlay(circleMarker)
    })
  }
  // watch(() => config.dataset, (newVl, oldVl) => {
  //   if (config.type == coverEnum.CircleMarker) {
  //     console.log(newVl);
  //     createCircleMarkerGroup()
  //   }
  // })
  return {
    overlayGroup,
    createCircleMarkerGroup
  }
}

export const usePolygonGroup = (config: any, map) => {
  const overlayGroup = createOverlayGroup(map)
  const { dataset, options } = config
  const createPolygonGroup = () => {
    console.log("createPolygonGroup");
    overlayGroup.clearOverlays()
    // let _options = { ...options }
    dataset.forEach(data => {
      let _key = ["path", "fillColor", 'strokeOpacity', 'fillOpacity', 'strokeColor', "strokeWeight", "strokeStyle"]
      Object.keys(data).forEach((key) => {
        if (_key.includes(key)) {
          options[key] = data[key]
        }
      })
      options.extData = data
      let polygon = createPolygon(options)
      polygon && overlayGroup.addOverlay(polygon)
    })
  }
  // watch(() => config.dataset, (newVl, oldVl) => {
  //   if (config.type == coverEnum.Polygon) {
  //     createPolygonGroup()
  //   }
  // })

  return {
    overlayGroup,
    createPolygonGroup
  }
}


export const usePolylineGroup = (config: any, map) => {
  const overlayGroup = createOverlayGroup(map)
  const { dataset, options } = config
  const createPolylineGroup = () => {
    console.log("usePolylineGroup");
    overlayGroup.clearOverlays()
    // let _options = { ...options }
    dataset.forEach(data => {
      let _key = ["path", "strokeColor", 'strokeOpacity', 'strokeWeight', 'strokeStyle', "lineJoin", "lineCap", "showDir"]
      Object.keys(data).forEach((key) => {
        if (_key.includes(key)) {
          options[key] = data[key]
        }
      })
      options.extData = data
      let polyline = createPolyline(options)
      polyline && overlayGroup.addOverlay(polyline)
    })
  }
  // watch(() => config.dataset, (newVl, oldVl) => {
  //   if (config.type == coverEnum.Polyline) {
  //     createPolylineGroup()
  //   }
  // })
  return {
    overlayGroup,
    createPolylineGroup
  }
}


export const useGroup = (config: any) => {
  const groupMap = new Map()
  const createGroup = (map) => {
    map.clearMap();
    if (config.type == coverEnum.Marker) {
      const { overlayGroup, createMarkerGroup } = useMarkerGroup(config, map)
      createMarkerGroup()
    } else if (config.type == coverEnum.Circle) {
      const { overlayGroup, createCircleMarkerGroup } = useCircleMarkerGroup(config, map)
      createCircleMarkerGroup()
    } else if (config.type == coverEnum.Polygon) {
      const { overlayGroup, createPolygonGroup } = usePolygonGroup(config, map)
      createPolygonGroup()
    } else if (config.type == coverEnum.Polyline) {
      const { overlayGroup, createPolylineGroup } = usePolylineGroup(config, map)
      createPolylineGroup()
    }
  }

  return {
    groupMap,
    createGroup
  }
}