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

describe('Get schema version', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema version', async () => {
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

      const updateSchema = await Schema.Update(state.schemaId, newSchemaName, schemaType, newSchemabody, newVersion)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))

      await new Promise((r) => setTimeout(r, 2000));

      const getSchemaVersion = await GetSchema.VersionById(state.schemaId, '1.0.0')
      console.log('Get Schema Version: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(200)
      expect(getSchemaVersion.data.id).toBe(state.schemaId)
      expect(getSchemaVersion.data.schema_name).toBe(schemaName)
      expect(getSchemaVersion.data.schema_type).toBe(schemaType)
      expect(getSchemaVersion.data.schema_body.description).toBe(schemabodyDesc)
      expect(getSchemaVersion.data.schema_body.additionalProperties).toBe(additional)
      expect(getSchemaVersion.data.version).toBe('1.0.0')

      const getSchemaVersion2 = await GetSchema.VersionById(state.schemaId, '1.0.1')
      console.log('Get Schema Version2: ', JSON.stringify(getSchemaVersion2.data, null, 2))
      expect(getSchemaVersion2.status).toEqual(200)
      expect(getSchemaVersion2.data.id).toBe(state.schemaId)
      expect(getSchemaVersion2.data.schema_name).toBe(schemaName)
      expect(getSchemaVersion2.data.schema_type).toBe(schemaType)
      expect(getSchemaVersion2.data.schema_body.description).toBe(newSchemaDesc)
      expect(getSchemaVersion2.data.schema_body.additionalProperties).toBe(newAdditional)
      expect(getSchemaVersion2.data.version).toBe(newVersion)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema version by incorrect ID', async () => {
    try {
      const dummySchemaId = uuidv4()
      const getSchemaVersion = await GetSchema.VersionById(dummySchemaId, '1.0.0')
      console.log('Get Schema Version: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Get schema version by incorrect version', async () => {
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

      const getSchemaVersion = await GetSchema.VersionById(state.schemaId, '1.0.3')
      console.log('Get schema by ID: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
