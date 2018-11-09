import {takeEvery, takeLatest, take, call, fork, put} from 'redux-saga/effects';
import * as actions from '../actions/users';
import * as api from '../api/users';

// a generator function:
// - shouldn't expect every line to run and finish in one process
// - always yield value(s)
// - yield: return a value, and wait for us to instruct it to run again
// - can have one or multiple yield statements in a generator function
// - must iterate each yield until no more code is left to run in the generator and it terminates
function* getUsers(){
    try {
        const result = yield call(api.getUsers);
        yield put(actions.getUsersSuccess({
            items: result.data.data
        }));
    }catch(e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to get the users.'
        }));
    }
}

// watchXxx - watcher (non-blocking) saga: takes a dispatched redux action, acts upon it with a worker saga
function* watchGetUsersRequest(){ 
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers); // getUsers - worker saga
}

function* createUsers(action) {
    try{
        yield call(api.createUser, {firstName: action.payload.firstName, lastName: action.payload.lastName});
        yield call(getUsers);
    }catch(e){
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user.'
        }));
    }
}

function* watchCreateUserRequest(){
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUsers);
}

function* deleteUser({userId}) {
    try{
        yield call(api.deleteUser, userId);
        yield call(getUsers);
    }catch(e){
        yield put(actions.usersError({
            error: 'An error occurred when trying to delete the user.'
        }));
    }
}

// blocking saga
function* watchDeleteUserRequest(){
    while (true) { // need to wait for the current saga to resolve before resolving subsequent requests
        const action = yield take(actions.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, {
            userId: action.payload.userId
        });
    }
}

// fork: separate logic in separate processes; 
// - easier to locate bugs and act upon them, without affecting other processes/logic
// - different logic running in parallel, i.e. no need to wait for others to finish first
const userSagas = [
    fork(watchGetUsersRequest),
    fork(watchCreateUserRequest),
    fork(watchDeleteUserRequest)
];

export default userSagas;