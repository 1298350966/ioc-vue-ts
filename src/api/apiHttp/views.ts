import { Get, Post, Delete, Patch } from "../axios";
import { Result } from "../type";

const viewsUrl = '/api/views'

export const findOneViewsHttp = (id: string | number) => {
  return Get<Result>(viewsUrl + "/" + id)
};

export const findAllViewsHttp = (params) => {
  return Get<Result>(viewsUrl,params)
};

export const addViewsHttp = ( param:any) => {
  return Post<Result>(viewsUrl, param)
};

export const updateViewsHttp = (id: string, param:any) => {
  return Patch<Result>(viewsUrl + "/" + id, param)
};

export const deleteViewsHttp = (id: string) => {
  return Delete<Result>(viewsUrl + "/" + id)
};