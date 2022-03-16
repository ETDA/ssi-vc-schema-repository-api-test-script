import { Schema } from './schema'
import * as fs from 'fs'
import FormData from 'form-data'
import { INVALID } from '../consts'
import { v4 as uuidv4 } from 'uuid'

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

describe('Update schema by upload', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Update schema by upload', async () => {
    try {
      let formData1 = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files)
      const uploadSchema = await Schema.Upload(formData1)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01_update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.schemaId, formData2)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)

    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema by upload - Upload with invalid version', async () => {
    try {
      let formData1 = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files)
      const uploadSchema = await Schema.Upload(formData1)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01_update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.schemaId, formData2)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Upload with not created schema', async () => {
    try {
      state.schemaId = uuidv4()
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema-incomplete.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.UploadUpdate(state.schemaId,formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Upload incorrect file type', async () => {
    try {
      state.schemaId = uuidv4()
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema.json`)
      formData.append('file', files)
      const uploadSchema = await Schema.UploadUpdate(state.schemaId,formData)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Upload incomplete file', async () => {
    try {
      let formData1 = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files)
      const uploadSchema = await Schema.Upload(formData1)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01_update-incomplete.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.schemaId, formData2)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Send request without file', async () => {
    try {
      let formData1 = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files)
      const uploadSchema = await Schema.Upload(formData1)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      formData2.append('file','')
      const updateSchema = await Schema.UploadUpdate(state.schemaId, formData2)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
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

