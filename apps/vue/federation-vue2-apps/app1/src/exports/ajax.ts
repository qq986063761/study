import apiList from '../ajax/apiList'
import createAjaxList, { InjectedAjax } from '../ajax/ajaxList'

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
