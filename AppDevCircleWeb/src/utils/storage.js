export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const deleteStorage = (key) => {
  return localStorage.removeItem(key)
}
