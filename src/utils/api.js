import axios from 'axios'
import { baseURL } from '../utils/baseUrl'
// axios.defaults.baseURL
// 需要根据开发还是上线 拿到不同的地址
// console.log('地址', process.env.REACT_APP_URL,baseURL)
const instance = axios.create({
    baseURL:baseURL
})
export default instance