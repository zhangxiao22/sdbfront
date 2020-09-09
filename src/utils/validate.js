/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isNumber(val) {
  var regPos = / ^\d+$/ // 非负整数
  var regNeg = /^\-[1-9][0-9]*$/ // 负整数
  if (regPos.test(val) && regNeg.test(val)) {
    return true
  } else {
    return false
  }
}

export function isPhone(val) {
  const reg = /^1\d{10}$/ // 1开头的11位
  return reg.test(val)
}
