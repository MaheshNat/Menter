import axios from 'axios';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

export const loadInvitations = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOADING_INVITATIONS' });
    axios
      .get('auth/user', tokenConfig(getState))
      .then((res) => {
        axios
          .post(
            'auth/names',
            {
              ids: [
                ...res.data.incomingInvitations.map(
                  (incomingInvitation) => incomingInvitation.userId
                ),
                ...res.data.outgoingInvitations.map(
                  (outgoingInvitation) => outgoingInvitation.userId
                ),
                ...res.data.cancelledInvitations.map(
                  (cancelledInvitation) => cancelledInvitation.userId
                ),
                ...res.data.scheduledMeetings.map(
                  (scheduledMeeting) => scheduledMeeting.userId
                ),
                ...res.data.completedMeetings.map(
                  (completedMeeting) => completedMeeting.userId
                ),
              ],
            },
            tokenConfig(getState)
          )
          .then((names) => {
            names = names.data;
            res.data.incomingInvitations = res.data.incomingInvitations.map(
              (incomingInvitation) => ({
                ...incomingInvitation,
                name: names[incomingInvitation.userId],
              })
            );
            res.data.outgoingInvitations = res.data.outgoingInvitations.map(
              (outgoingInvitation) => ({
                ...outgoingInvitation,
                name: names[outgoingInvitation.userId],
              })
            );
            res.data.cancelledInvitations = res.data.cancelledInvitations.map(
              (cancelledInvitation) => ({
                ...cancelledInvitation,
                name: names[cancelledInvitation.userId],
              })
            );
            res.data.scheduledMeetings = res.data.scheduledMeetings.map(
              (scheduledMeeting) => ({
                ...scheduledMeeting,
                name: names[scheduledMeeting.userId],
              })
            );
            res.data.completedMeetings = res.data.completedMeetings.map(
              (completedMeeting) => ({
                ...completedMeeting,
                name: names[completedMeeting.userId],
              })
            );
            dispatch({ type: 'INVITATIONS_LOADED', payload: res.data });
          });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};

export const sendInvitation = (subject, userId, type) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_STATUS', status: 'Sending Invitation...' });
    axios
      .post(
        'invitation/send',
        { subject: subject, userId: userId, type: type },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({ type: 'SET_STATUS', status: 'Invitation sent.' });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};

export const acceptInvitation = (invitationId) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_STATUS', status: 'Accepting invitation...' });
    axios
      .post(
        'invitation/accept',
        { invitationId: invitationId },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({ type: 'SET_STATUS', status: 'Invitation accepted.' });
        dispatch({ type: 'ACCEPT_INVITATION', id: invitationId });
      })
      .catch((err) => {
        console.log(err);
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};

export const cancelInvitation = (invitationId) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_STATUS', status: 'Cancelling invitation.' });
    axios
      .post(
        'invitation/cancel',
        { invitationId: invitationId },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({ type: 'SET_STATUS', status: 'Invitation cancelled.' });
        dispatch({ type: 'CANCEL_INVITATION', id: invitationId });
      })
      .catch((err) => {
        console.log(err);
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};

export const denyInvitation = (invitationId) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_STATUS', status: 'Denying invitation...' });
    axios
      .post(
        'invitation/deny',
        { invitationId: invitationId },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({ type: 'SET_STATUS', status: 'Invitation denied.' });
        dispatch({ type: 'DENY_INVITATION', id: invitationId });
      })
      .catch((err) => {
        console.log(err);
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};

export const completeMeeting = (meetingId, rating) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_STATUS', status: 'Completing meeting...' });
    axios
      .post(
        'invitation/complete',
        { meetingId: meetingId, rating: rating },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({ type: 'SET_STATUS', status: 'Meeting completed.' });
        dispatch({ type: 'COMPLETE_MEETING', id: meetingId });
      })
      .catch((err) => {
        console.log(err);
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'SET_STATUS', status: null });
      });
  };
};
