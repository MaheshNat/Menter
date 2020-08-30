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
      let __newCancelledInvitations = state.cancelledInvitations.slice();
      __newCancelledInvitations.push(
        state.outgoingInvitations.find(
          (outgoingInvitation) => outgoingInvitation._id === action.id
        )
      );
      return {
        ...state,
        outgoingInvitations: newOutgoingInvitations,
        cancelledInvitations: __newCancelledInvitations,
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
      let newCancelledInvitations = state.cancelledInvitations.slice();
      newCancelledInvitations.push(
        state.incomingInvitations.find(
          (incomingInvitation) => incomingInvitation._id === action.id
        )
      );
      let _newIncomingInvitations = state.incomingInvitations.slice();
      _newIncomingInvitations = _newIncomingInvitations.filter(
        (incomingInvitation) => incomingInvitation._id !== action.id
      );
      return {
        ...state,
        cancelledInvtiations: newCancelledInvitations,
        incomingInvitations: _newIncomingInvitations,
      };
    case 'COMPLETE_MEETING':
      let newCompletedMeetings = state.completedMeetings.slice();
      newCompletedMeetings.push(
        state.scheduledMeetings.find(
          (scheduledMeeting) => scheduledMeeting._id === action.id
        )
      );
      let _newScheduledMeetings = state.scheduledMeetings.slice();
      _newScheduledMeetings = _newScheduledMeetings.filter(
        (scheduledMeeting) => scheduledMeeting._id !== action.id
      );
      return {
        ...state,
        completedMeetings: newCompletedMeetings,
        scheduledMeetings: _newScheduledMeetings,
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
