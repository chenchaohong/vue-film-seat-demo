export default {
    isMobile: value => /^1\d{10}$/.test(value),
    isInteger: value => /^\d{1,10}$/.test(value),
    isAmount: value => /^\d{1,10}(\.\d{1,2})?$/.test(value),
    isRate: value => /^((([1-9]\d{0,1}|0)(\.\d{1,4})?)|100)$/.test(value),
    isLoginName: value => /^[\dA-Za-z]{4,20}$/.test(value),
    isEmail: value => /^[0-9a-zA-Z_-]{1,30}@([0-9a-zA-Z_-]{1,28}\.[0-9a-zA-Z_-]+)+$/.test(value),
    isPwd: value => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(value)
}
