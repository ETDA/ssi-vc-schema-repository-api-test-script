import axios from 'axios'
import { AUTHORIZATION, CONFIG } from '../../consts'

const genHeader = () => {
  return {
    headers: {
      'Authorization': `FINEMA ${AUTHORIZATION.TOKEN}`
    }
  }
}

export class GetSchema {
  static async All () {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas`, { headers: res.headers })
  }

  static async ById (schemaId: string) {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/${schemaId}`,{ headers: res.headers })
  }

  static async HistoryById (schemaId: string) {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/${schemaId}/history`,{ headers: res.headers })
  }

  static async VersionById (schemaId: string, version: string) {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/${schemaId}/${version}`,{ headers: res.headers })
  }

  static async Json (schemaId: string,version: string, fileName: string) {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/${schemaId}/${version}/${fileName.replace(/[^A-Za-z0-9]+/g, "")}.json`,{ headers: res.headers })
  }

  static async Reference (schemaId: string, version: string, ref:string) {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/${schemaId}/${version}/schema/${ref}`,{ headers: res.headers })
  }

  static async Type () {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/types`,{ headers: res.headers })
  }

  static async Token () {
    const res = genHeader()
    return await axios.get(`${CONFIG.BASE_URL}/api/schemas/tokens`,{ headers: res.headers })
  }
}
