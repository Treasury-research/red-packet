export const apiCreator = (baseUrl, baseOptions = {}) => async (method = 'GET', endPoint = '/hello', params = {}, moreOptions = {}) => {
  const options = { ...baseOptions, ...moreOptions }
  const apiKey = options.apiKey
  const requireAuth = options.requireAuth
  const headers = options.headers || {}
  const tokenFetcher = options.tokenFetcher
  const errorTransformer = options.errorTransformer || (error => Promise.reject({ message: error }))
  const responseTransformer = options.responseTransformer || (res => res)
  let fetchParams = params

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  if (requireAuth && tokenFetcher) {
    const token = await tokenFetcher()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  if (apiKey && typeof apiKey === 'object' && apiKey.key && apiKey.value) {
    if (apiKey.position && apiKey.position === 'params') {
      fetchParams = { ...params, [apiKey.key]: apiKey.value }
    } else {
      headers[apiKey.key] = apiKey.value
    }
  }

  const fetchOptions = { method, headers }

  if (method === 'GET') {
    const queryString = `${Object.keys(fetchParams)
      .map(k => [k, fetchParams[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      fetchOptions.body = `${Object.keys(fetchParams).map(k => [k, fetchParams[k]].join('=')).join('&')}`
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']
      const formData = new FormData()
      Object.keys(fetchParams).forEach(key => formData.append(key, fetchParams[key]))
      fetchOptions.body = formData
    } else {
      fetchOptions.body = JSON.stringify(fetchParams)
    }
  }

  return fetch(url, fetchOptions).then((res) => {
    if (!res.ok) {
      return res.json().then(errorTransformer)
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json().then(responseTransformer)
    } else if (/event-stream/.test(contentType)) {
      return res.body
    } else if (/text/.test(contentType)) {
      return res.text().then(responseTransformer)
    } else if (/javascript/.test(contentType)) {
      return res.text().then(responseTransformer)
    } else if (/css/.test(contentType)) {
      return res.text().then(responseTransformer)
    }

    return null
  })
}

const responseTransformer = res => res.data
const errorTransformer = res => Promise.reject({ message: res.message })

const SERVER_URL = `https://knn3-gateway.knn3.xyz/tg-redpacket-backend`
export const redPacketApi = apiCreator(`${SERVER_URL}/api/v1`, { responseTransformer, errorTransformer })

export const login = (params = {}) => redPacketApi('POST', '/auth/login', params)
export const challenge = (params = {}) => redPacketApi('POST', '/auth/challenge', params)
export const sign = (params = {}, options) => redPacketApi('POST', '/sign', params, options)
export const refresh = (params = {}, options) => redPacketApi('POST', '/auth/refresh', params, options)
export const bindAddress = (params = {}, options) => redPacketApi('POST', '/user/bindAddress', params, options)
export const getClaimHistory = (params = {}, options) => redPacketApi('GET', '/user/claim', params, options)
export const getUserInfo = (params = {}, options) => redPacketApi('GET', '/user/info', params, options)
export const getRedPacket = ({ id }, options) => redPacketApi('GET', `/redpacket/${id}`, {}, options)
