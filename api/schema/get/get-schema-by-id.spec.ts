import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'
const faker = require('faker')
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  keyId: '',
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

describe('Get schema by ID',()=>{
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema by ID', async () => {
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

      const getSchemabyId = await GetSchema.ById(state.schemaId)
      console.log('Get schema by ID: ', JSON.stringify(getSchemabyId.data, null, 2))
      expect(getSchemabyId.status).toEqual(200)
      expect(getSchemabyId.data.id).toBe(state.schemaId)
      expect(getSchemabyId.data.schema_name).toBe(schemaName)
      expect(getSchemabyId.data.schema_type).toBe(schemaType)
      expect(getSchemabyId.data.schema_body.description).toBe(schemabodyDesc)
      expect(getSchemabyId.data.schema_body.additionalProperties).toBe(additional)
      expect(getSchemabyId.data.version).toBe('1.0.0')
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema by incorrect ID', async () => {
    try {
      const dummySchemaId = uuidv4()
      const getSchemabyId = await GetSchema.ById(dummySchemaId)
      console.log('Get schema by ID: ', JSON.stringify(getSchemabyId.data, null, 2))
      expect(getSchemabyId.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
