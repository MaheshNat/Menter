const initState = {
  incomingInvitations: [],
  outgoingInvitations: [],
  cancelledInvitations: [],
  scheduledMeetings: [],
  completedMeetings: [],
  isLoading: false,
  invitationsLoaded: false,
  status: null,
};

const errorReducer = (state = initState, action) => {
  console.log(action);
  switch (action.type) {
    case 'CANCEL_INVITATION':
      let newOutgoingInvitations = state.outgoingInvitations.slice();
      newOutgoingInvitations = newOutgoingInvitations.filter(
        (outgoingInvitation) => outgoingInvitation._id !== action.id
      );
      return {
        ...state,
        outgoingInvitations: newOutgoingInvitations,
      };
    case 'ACCEPT_INVITATION':
      let newScheduledMeetings = state.scheduledMeetings.slice();
      newScheduledMeetings.push(
        state.incomingInvitations.find(
          (incomingInvitation) => incomingInvitation._id === action.id
        )
      );
      let newIncomingInvitations = state.incomingInvitations.slice();
      newIncomingInvitations = newIncomingInvitations.filter(
        (incomingInvitation) => incomingInvitation._id !== action.id
      );
      return {
        ...state,
        scheduledMeetings: newScheduledMeetings,
        incomingInvitations: newIncomingInvitations,
      };
    case 'DENY_INVITATION':
      let newCancelledMeetings = state.cancelledMeetings.slice();
      newCancelledMeetings.push(
        state.incomingInvitations.find(
          (incomingInvitation) => incomingInvitation._id === action.id
        )
      );
      let newIncomingInvitations = state.incomingInvitations.slice();
      newIncomingInvitations = newIncomingInvitations.filter(
        (incomingInvitation) => incomingInvitation._id !== action.id
      );
      return {
        ...state,
        cancelledMeetings: newCancelledMeetings,
        incomingInvitations: newIncomingInvitations,
      };
    case 'INVITATIONS_LOADED':
      return {
        ...state,
        incomingInvitations: action.payload.incomingInvitations,
        outgoingInvitations: action.payload.outgoingInvitations,
        cancelledInvitations: action.payload.cancelledInvitations,
        scheduledMeetings: action.payload.scheduledMeetings,
        completedMeetings: action.payload.completedMeetings,
        isLoading: false,
        invitationsLoaded: true,
      };
    case 'LOADING_INVITATIONS':
      return {
        ...state,
        isLoading: true,
        invitationsLoaded: false,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
};
export default errorReducer;
