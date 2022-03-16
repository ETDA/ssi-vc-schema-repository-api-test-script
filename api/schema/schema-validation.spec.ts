import { SchemaBody } from './schema-body'
import { Schema } from './schema'
import { v4 as uuidv4 } from 'uuid'
import { ERR_REQUIRE, INVALID } from '../consts'
const faker = require('faker')

let getInitState: any = () => ({
  keyId: '',
  schemaId: '',
  fullSchemaId: '',
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

describe('Schema validation', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Validate schema - string type', async () => {
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

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const document = {
        'example_string': 'Testing'
      }
      const schemaValidate = await Schema.Validate(state.fullSchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(200)
      expect(schemaValidate.data.valid).toBe(true)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Validate schema - number type', async () => {
    try {
      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_number': {
          'type': 'number'
        }
      }
      const schemaRequired = ['example_number']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const document = {
        'example_number': 3
      }
      const schemaValidate = await Schema.Validate(state.fullSchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(200)
      expect(schemaValidate.data.valid).toBe(true)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Validate schema - array type', async () => {
    try {
      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_array': {
          'type': 'array'
        }
      }
      const schemaRequired = ['example_array']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const document = {
        'example_array': ['a','b','c']
      }
      const schemaValidate = await Schema.Validate(state.fullSchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(200)
      expect(schemaValidate.data.valid).toBe(true)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Validate schema - boolean type', async () => {
    try {
      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_boolean': {
          'type': 'boolean'
        }
      }
      const schemaRequired = ['example_boolean']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const document = {
        'example_boolean': true
      }
      const schemaValidate = await Schema.Validate(state.fullSchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(200)
      expect(schemaValidate.data.valid).toBe(true)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Validate Schema - Send request with incorrect schema_id', async () => {
    try {
      const document = {
        'example_string': 'Testing'
      }

      const dummySchemaId = `https://ssi-test.teda.th/api/schemas/${uuidv4()}/1.0.0/schema`
      const schemaValidate = await Schema.Validate(dummySchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Validate Schema - Send request with incorrect document detail', async () => {
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

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const document = {
        'example_string': 1
      }
      const schemaValidate = await Schema.Validate(state.fullSchemaId, document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(200)
      expect(schemaValidate.data.valid).toBe(false)

    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Validate Schema - Send request without schema_id', async () => {
    try {
      const document = {
        'example_string': 'Testing'
      }

      const schemaValidate = await Schema.Validate('', document)
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.schema_id.code).toBe(ERR_REQUIRE.SCHEMA_ID_REQUIRED.CODE)
      expect(err.response.data.fields.schema_id.message).toBe(ERR_REQUIRE.SCHEMA_ID_REQUIRED.MESSAGE)
    }
  })

  test('Validate Schema - Send request without document detail', async () => {
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

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const schemaValidate = await Schema.Validate(state.fullSchemaId, '')
      console.log('Schema Validate: ', JSON.stringify(schemaValidate.data, null, 2))
      expect(schemaValidate.status).toEqual(400)
    } catch (err) {
      console.log(JSON.stringify(err.response.data, null, 2))
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.document.code).toBe(INVALID.INVALID_JSON.CODE)
      expect(err.response.data.fields.document.message).toBe(INVALID.INVALID_JSON.MESSAGE)
    }
  })
})
