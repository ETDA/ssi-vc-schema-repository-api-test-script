// @ts-ignore
const { createSign } = require('crypto')
const rsaKeyPair = require('rsa-keypair')

interface IKEY {
  private_key: string
  public_key: string
}

export class CryptoHelper {
  static genKeys (): IKEY {
    let keys = rsaKeyPair.generate(2048)
    return {
      private_key: keys.privateKey.toString(),
      public_key: keys.publicKey.toString()
    }
  }

  static sign (privateKey: string, message: any): string {
    const sign = createSign('SHA256')
    sign.update(message)
    sign.end()
    const signature = sign.sign(privateKey, 'base64')
    return signature
    // const key = new ECKey(privateKey, 'pem')
    // return key.createSign('SHA256')
    //   .update(message)
    //   .sign('base64')
  }

  static encodeBase64 (data: any): string {
    if (typeof Buffer === 'function') {
      return Buffer.from(data, 'utf-8').toString('base64')
    } else {
      throw new Error('Failed to determine the platform specific encoder')
    }
  }

  static sha256 (msg: string): string {
    // @ts-ignore
    return sha256(msg)
  }
}

