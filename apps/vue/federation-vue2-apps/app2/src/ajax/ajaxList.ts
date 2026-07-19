type AjaxMethod = <T = unknown>(
  key: string,
  params?: Record<string, unknown>,
  config?: Record<string, unknown>
) => Promise<T>

export interface InjectedAjax {
  appName: string
  get: AjaxMethod
  post: AjaxMethod
  put: AjaxMethod
  patch: AjaxMethod
  delete: AjaxMethod
}

function createAjaxList(ajax: InjectedAjax) {
  return {
    getUsers(params: Record<string, unknown> = {}) {
      return ajax.post('getUsers', params)
    }
  }
}

export default createAjaxList
