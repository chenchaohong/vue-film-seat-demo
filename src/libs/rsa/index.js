
import rsa from './rsa'

const RSA_EXPONENT = '10001'
const RSA_MODULUS = 'c2c0696059df8ab68e837990a1730f9d0f49bc0e3cfba775762a7fb2cd1943b67b88c2486e04995ba2456407c374067e348a422ad14ae486be07b21b16291cbc9daa3608c5e5f13a40516508c338b995954f6f82e8ed21595600ad916f42f614bd6d6932cee35677590258c70a95c250250fa6706a93a112d94e133059ab5f91'

/**
 * rsa加密
 * @param {Object} text
 */
export function rsaEncrypt (text) {
    let key = new rsa.RSAKeyPair(RSA_EXPONENT, '', RSA_MODULUS)
    let encryptRtn = rsa.encryptedString(key, text)
    return encryptRtn
}

/**
 * rsa解密
 * @param {Object} text
 */
export function rsaDecrypt (text) {
    let key = new rsa.RSAKeyPair('', RSA_EXPONENT, RSA_MODULUS)
    let decryptedRtn = rsa.decryptedString(key, text)
    return decryptedRtn
}
