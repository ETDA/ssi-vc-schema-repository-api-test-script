import { Schema } from './schema'
import * as fs from 'fs'
import FormData from 'form-data'
import { INVALID } from '../consts'

let getInitState: any = () => ({
  keyId: '',
  schemaId: '',
  didKey1: [],
  didKey2: [],
  didKey3: [],
  didKey4: [],
  data: {
    did: '',
    nonce: ''
  },
  didId: ''
})

describe('Schema upload', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Upload schema', async () => {
    try {
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Upload VC Schema - Upload incorrect file type', async () => {
    try {
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema.json`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Upload VC Schema - Upload incomplete file', async () => {
    try {
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema-incomplete.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Upload VC Schema - Upload without file', async () => {
    try {
      let formData = new FormData()
      // const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema-incomplete.zip`)
      formData.append('file', '')
      const uploadSchema = await Schema.Upload(formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.NO_SCHEMA_FILE.CODE)
      expect(err.response.data.message).toBe(INVALID.NO_SCHEMA_FILE.MESSAGE)
    }
  })
})

