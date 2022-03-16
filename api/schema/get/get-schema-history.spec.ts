import { Schema } from '../schema'
import { SchemaBody } from '../schema-body'
import { GetSchema } from './get'
import { v4 as uuidv4 } from 'uuid'
const faker = require('faker')

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

describe('Get schema history', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema history', async () => {
    try {
      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = schemaName + '_Update'
      const newSchemaDesc = schemabodyDesc + '_Update'
      const newSchemaBodyProperties = {
        'example_data': {
          'type': 'string'
        }
      }
      const newShemaRequired = ['example_data']
      const newAdditional = true
      const newVersion = '1.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.schemaId,newSchemaName, schemaType,newSchemabody,newVersion)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data,null, 2))

      expect(updateSchema.status).toEqual(200)

      await new Promise(resolve => setTimeout(resolve, 2000));

      const getSchemaHistory = await GetSchema.HistoryById(state.schemaId)
      console.log('Get Schema History: ', JSON.stringify(getSchemaHistory.data,null, 2))
      expect(getSchemaHistory.status).toEqual(200)

      expect(getSchemaHistory.data[0].id).toBe(state.schemaId)
      expect(getSchemaHistory.data[0].schema_name).toBe(schemaName)
      expect(getSchemaHistory.data[0].schema_type).toBe(schemaType)
      expect(getSchemaHistory.data[0].schema_body.description).toBe(schemabodyDesc)
      expect(getSchemaHistory.data[0].schema_body.additionalProperties).toBe(additional)
      expect(getSchemaHistory.data[0].version).toBe('1.0.0')

      expect(getSchemaHistory.data[1].id).toBe(state.schemaId)
      expect(getSchemaHistory.data[1].schema_name).toBe(schemaName)
      expect(getSchemaHistory.data[1].schema_type).toBe(schemaType)
      expect(getSchemaHistory.data[1].schema_body.description).toBe(newSchemaDesc)
      expect(getSchemaHistory.data[1].schema_body.additionalProperties).toBe(newAdditional)
      expect(getSchemaHistory.data[1].version).toBe(newVersion)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema history by incorrect ID', async () => {
    try {
      const dummySchemaId = uuidv4()
      const getSchemaHistory = await GetSchema.HistoryById(dummySchemaId)
      console.log('Get Schema History: ', JSON.stringify(getSchemaHistory.data,null, 2))
      expect(getSchemaHistory.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
