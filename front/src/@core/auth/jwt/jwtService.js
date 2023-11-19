import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isRefreshing = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    let refreshSubscribers = []

    const onRefreshed = (token) => {
      refreshSubscribers.map((callback) => callback(token))
    }

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken.replace(/^"(.*)"$/, '$1')}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              refreshSubscribers.push((token) => {
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${token}`
                resolve(axios(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          return new Promise((resolve, reject) => {
            if (!this.getRefreshToken()) {
                return reject(error)
            }
            this.refreshToken().then((r) => {
              this.setToken(r.data.access.token)
              this.setRefreshToken(r.data.refresh.token)
              this.onAccessTokenFetched(r.data.access.token)
              originalRequest.headers.Authorization = `Bearer ${r.data.access.token}`
              onRefreshed(r.data.access.token)
              resolve(axios(originalRequest))
            }).catch((error) => {
              reject(error)
            }).finally(() => {
              this.isRefreshing = false
              refreshSubscribers = []
            })
          })
        }

        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken().replace(/^"(.*)"$/, '$1')
    })
  }
}
