import rootReducer from 'reducer';
import { Action, applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

const persistConfig = {
  key: 'app',
  storage: storage,
  blacklist: [
    'user',
    'kyc',
    'categorymaster',
    'campaign',
    'systemconfig',
    'profile',
    'dashboard',
    'banner',
    'spin',
    'luckyspin',
    'partner',
    'partnerdetail',
    'referralCounter',
    'satoshiGame',
    'homepageBanner',
    'saleSchedule',
    'privateSale',
    'depositSatoshiDetail',
    'bitFarm',
    'playerList',
    'playerDetail',
    'p2pTransaction',
    'withdrawalVndc',
    'account',
    'reward',
    'game',
    'challenge',
    'friendInvitationEvent',
    'friendInvitationEventDetail',
    'broker',
    'brokerDetail',
    'announcementBitfarm',
    'stacking',
    'rankDetail',
    'rank',
    'statisticStacking',
    'statisticStackingDetail',
    'referral',
    'luckySpinStatistic',
    'luckySpinDetail',
  ],
};
const pReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  typeof window === 'object' &&
  process.env.NODE_ENV === 'development' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(pReducer, enhancer);
const persist = persistStore(store);

export type AppDispatch = ThunkDispatch<RootState, any, Action>;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export { persist, store };
