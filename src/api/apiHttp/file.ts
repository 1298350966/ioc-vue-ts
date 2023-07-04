import { PostFormData } from "../axios";
import { Result } from "../type";

const viewsUrl = '/api/upload'

export const uploadHttp = async (file:File) => {
  let formData = new FormData()
  formData.append("file", file)
  return PostFormData<Result>(viewsUrl, formData)
};

