import L from "leaflet"

class CoverGroupClass{
  coverGroup:Map<string,any> = new Map()
  InfoWindow:L.popup
  constructor(){

  }
  setInfoWindow(InfoWindow){
    this.InfoWindow = InfoWindow
  }
  removeInfoWindow(){
    this.InfoWindow =  null
  }
  addCoverGroup(){
    
  }
}
