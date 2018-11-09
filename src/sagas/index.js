import userSagas from './users';
import {all} from 'redux-saga/effects';

export default function* rootSaga() {
    // allow all forked processes/sagas to be created in parallel
    yield all([     // all: resolve all promises simultaneously, then act on them once
        ...userSagas // spread operator: creates a new array from the imported array, 
                      // then copy it into the array within the square brackets
    ])
}
