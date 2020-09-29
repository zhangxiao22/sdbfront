export const formatMoney = function (val) {
  if (!val && val !== 0) {
    return ''
  } else {
    return parseInt(val).toLocaleString()
  }
}
