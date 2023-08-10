import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { CreateComponentType, CreateComponentGroupType} from '@/packages/index.d'
export class PreviewChartEdit implements ChartEditStorage{

  public editCanvasConfig
  public requestGlobalConfig
  public componentList:Array<CreateComponentType | CreateComponentGroupType>
  public globalVar
  public globalRequest
  public globalDialog:Array<CreateComponentType | CreateComponentGroupType>
  public globalFunction
  public globalProps
  public globalIframeEvent
  public componentMap:Map<string, CreateComponentType | CreateComponentGroupType> = new Map()
  public globalDialogMap:Map<string,any > = new Map()

  constructor(chartEditStorage :ChartEditStorage){
    Object.keys(chartEditStorage).forEach((key)=>{
      this[key] = chartEditStorage[key]
    })
    this.setComponentMap()
    this.setGlobalDialogMap()
  }

  setComponentMap(){

    const addComponentMap = (componentList:Array<CreateComponentType | CreateComponentGroupType>)=>{
      componentList.forEach((component)=>{
        if(component.isGroup){
          addComponentMap(component.groupList)
        }
        this.componentMap.set(component.id, component)
      })
    }
    addComponentMap(this.componentList)
  }
  
  setGlobalDialogMap(){
    this.globalDialog.forEach((dialog)=>{
      this.globalDialogMap.set(dialog.id, dialog)
    })
  }

  getComponent(id:string){
    return this.componentMap.get(id)
  }

  getDialog(id:string){
    return this.globalDialogMap.get(id)
  }
} 