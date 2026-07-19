type AjaxMethod = <T = unknown>(
  key: string,
  params?: Record<string, unknown>,
  config?: Record<string, unknown>,
) => Promise<T>

interface InjectedAjax {
  appName: string
  get: AjaxMethod
  post: AjaxMethod
  put: AjaxMethod
  patch: AjaxMethod
  delete: AjaxMethod
}

interface CreateAjaxOptions {
  ajax: InjectedAjax
}

interface AppAjaxModule {
  apiList: Record<string, string>
  ajaxList: {
    getUsers: (params?: Record<string, unknown>) => Promise<unknown>
  }
}

function createApp2Ajax({ ajax }: CreateAjaxOptions): AppAjaxModule {
  const apiList = {
    getUsers: '/getUsers',
  }

  return {
    apiList,
    ajaxList: {
      getUsers(params = {}) {
        return ajax.post('getUsers', params)
      },
    },
  }
}

export default createApp2Ajax
