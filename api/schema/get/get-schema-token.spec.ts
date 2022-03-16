import { Schema } from '../schema'
import { GetSchema } from './get'
import { SCHEMA_TOKEN_ROLES } from '../../consts'
const faker = require('faker')

let getInitState: any = () => ({
  token: '',
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

describe('Get schema token',()=>{
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema token', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = SCHEMA_TOKEN_ROLES.ADMIN
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(201)
      state.token = postSchemaToken.data.token

      const getSchemaToken = await GetSchema.Token()
      console.log('Get schema token: ', JSON.stringify(getSchemaToken.data, null, 2))
      expect(getSchemaToken.status).toEqual(200)
      expect(getSchemaToken.data.items[0].name).toEqual(tokenName)
      expect(getSchemaToken.data.items[0].token).toEqual(state.token)
      expect(getSchemaToken.data.items[0].role).toEqual(tokenRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
