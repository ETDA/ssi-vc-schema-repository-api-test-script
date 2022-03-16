import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'
const faker = require('faker')

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

describe('Get schema type',()=>{
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema type', async () => {
    try {
      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string',
          'alias':'Text'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      expect(createSchema.status).toEqual(201)

      await new Promise((r) => setTimeout(r, 2000));

      const getSchemaType = await GetSchema.Type()
      console.log('Get all schema: ', JSON.stringify(getSchemaType.data, null, 2))
      expect(getSchemaType.status).toEqual(200)
      expect(getSchemaType.data.types).toContain(schemaType)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
