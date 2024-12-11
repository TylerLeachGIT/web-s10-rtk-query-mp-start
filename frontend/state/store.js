import { configureStore } from '@reduxjs/toolkit'
import quotesReducer from './quotesSlice'
import { quotesApi } from './quotesApi'

export const store = configureStore({
  reducer: {
    quotes: quotesReducer,
    [quotesApi.reducerPath]: quotesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quotesApi.middleware)
})
