
export const changeCollapsed = (data) => {
  return {
    type: 'change-collapsed'
  }
}
export const changeSpining = (data)=>{
  return {
    type: 'change-spining',
    data
  }
}
// export const showSpining = ()=>{
//   return {
//     type: 'change-spining',
//     payloading: true
//   }
// }
// export const changeSpining = ()=>{
//   return {
//     type: 'change-spining'
//   }
// }