import { GetSchema } from './get'
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

describe('Get schema reference',()=>{
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema reference', async () => {
    try {
      state.schemaId = 'b6b96576-d823-40ae-8bff-97ba3884e207'
      const version = '1.0.0'
      const ref = 'Movie.json'

      const getSchemaRef = await GetSchema.Reference(state.schemaId, version,ref)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema reference by incorrect ID', async () => {
    try {
      state.schemaId = uuidv4()
      const version = '1.0.7'
      const ref = 'Composition-Schema.json'

      const getSchemaRef = await GetSchema.Reference(state.schemaId, version,ref)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Get schema reference by incorrect reference', async () => {
    try {
      state.schemaId = 'bff1e929-fb2b-433c-8b61-d87d2ad6b706'
      const version = '1.0.0'
      const ref = 'Composition.json'

      const getSchemaRef = await GetSchema.Reference(state.schemaId, version,ref)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
