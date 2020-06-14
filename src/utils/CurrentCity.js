import axios from 'axios'
export const getCurrentCity = () => {
    let city = JSON.parse(localStorage.getItem('city'))
    if(!city){
        return new Promise( (resolve,reject) => {
            var myCity = new window.BMap.LocalCity();
            myCity.get( async (result) => {
            let cityname = result.name
            let dwei = await axios.get('http://192.168.1.101:8080/area/info?name=%E5%8C%97%E4%BA%AC')
            localStorage.setItem('city',JSON.stringify(dwei))
            resolve(dwei.data.body)
        });
        })
    }else {
        return Promise.resolve(city)
    }
}