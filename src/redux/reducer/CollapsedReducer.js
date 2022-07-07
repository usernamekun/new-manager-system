
const InitState = {
  collapsed:false,
}
export function CollapsedReducer( preState=InitState, action) {
  const {type} = action
  switch(type) {
    case 'change-collapsed':
      let newState = {...preState}
      newState.collapsed = !newState.collapsed
      return newState
    default :
      return preState
  }
}