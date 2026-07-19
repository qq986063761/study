import apiList from './apiList'
import createAjaxList, { InjectedAjax } from './ajaxList'

interface CreateAjaxOptions {
  ajax: InjectedAjax
}

function createAppAjax({ ajax }: CreateAjaxOptions) {
  return {
    apiList,
    ajaxList: createAjaxList(ajax)
  }
}

export default createAppAjax
