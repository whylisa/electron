// 数组扁平化为对象，使用reduce
export const flattenArr = (arr) => {
    return arr.reduce((map, item) => {
        map[item.id] = item
        return map
    },{})
}
// 取对象的值为数组，map返回值为一个新的数组
export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}

export const getParentNode = (node, parentClassName) => {
    let current = node
    while(current !== null) {
        if( current.classList.contains(parentClassName)) {
            return current
        }
        current = current.parentNode
    }
    return false
}
// 时间戳转格式：2020/5/9 下午3:48:11
export const timestampToString = (timestamp) => {
    const date = new Date(timestamp)

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}