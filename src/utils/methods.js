//对象判空
export const isEmpty = (spurceObject) => {
  const res = JSON.stringify(spurceObject) == '{}'
  return res
}
//数组去重
export const unique = (arr) => {
  return Array.from(new Set(arr))
}
