export interface MarkerOptionsType{
    visible: boolean;
    zIndexOffset: number;
    latLng: any;
    pane: string;
    draggable: boolean;
    options: {
        shadowPane: string;
    };
    opacity: number;
    icon: {
        iconUrl: string;
        iconSize: number[];
        iconAnchor: number[];
    };
    extData: any;
}