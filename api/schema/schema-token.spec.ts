import { ERR_REQUIRE, INVALID, SCHEMA_TOKEN_ROLES } from '../consts'
import { Schema } from './schema'
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

describe('Post schema token', () => {
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Post schema token - ADMIN', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = SCHEMA_TOKEN_ROLES.ADMIN
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(201)
      expect(postSchemaToken.data.name).toBe(tokenName)
      expect(postSchemaToken.data.role).toBe(tokenRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Post schema token - READ/WRITE', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = SCHEMA_TOKEN_ROLES.READ_WRITE
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(201)
      expect(postSchemaToken.data.name).toBe(tokenName)
      expect(postSchemaToken.data.role).toBe(tokenRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Post schema token - READ', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = SCHEMA_TOKEN_ROLES.READ
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(201)
      expect(postSchemaToken.data.name).toBe(tokenName)
      expect(postSchemaToken.data.role).toBe(tokenRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Post schema token - Send request with incorrect role', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = 'Tester'
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.role.code).toBe(INVALID.INVALID_TOKEN_ROLE.CODE)
      expect(err.response.data.fields.role.message).toBe(INVALID.INVALID_TOKEN_ROLE.MESSAGE)
    }
  })

  test('Post schema token - Send request without name', async () => {
    try {
      const tokenName = ''
      const tokenRole = SCHEMA_TOKEN_ROLES.ADMIN
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.name.code).toBe(ERR_REQUIRE.TOKEN_NAME_REQUIRED.CODE)
      expect(err.response.data.fields.name.message).toBe(ERR_REQUIRE.TOKEN_NAME_REQUIRED.MESSAGE)
    }
  })
  test('Post schema token - Send request without role', async () => {
    try {
      const tokenName = faker.name.title()
      const tokenRole = ''
      const postSchemaToken = await Schema.Token(tokenName, tokenRole)
      console.log('Post schema token: ', JSON.stringify(postSchemaToken.data, null, 2))
      expect(postSchemaToken.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.role.code).toBe(INVALID.INVALID_TOKEN_ROLE.CODE)
      expect(err.response.data.fields.role.message).toBe(INVALID.INVALID_TOKEN_ROLE.MESSAGE)
    }
  })
})
