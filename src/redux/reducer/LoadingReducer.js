
const InitState = {
  spining: false
}
export const LoadingReducer = (preState=InitState,action) => {
  const { type,data } = action
  switch(type){
    case 'change-spining':
      let newState = {...preState}
      newState.spining = data
      return newState
    default:
      return preState
  }
}