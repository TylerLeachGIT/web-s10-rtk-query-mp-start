// create your RTK Query endpoints here
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quotesApi = createApi({
    reducerPath: 'quotesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9009/api/' }),
    tagTypes: ['Quotes'],
    endpoints: (builder) => ({
        getQuotes: builder.query({
            query: () => 'quotes',
            providesTags: ['Quotes']
        }),
        createQuote: builder.mutation({
            query: (newQuote) => ({
                url: 'quotes',
                method: 'POST',
                body: newQuote
            }),
            invalidatesTags: ['Quotes']
        }),
        toggleFake: builder.mutation({
            query: ({ id, apocryphal }) => ({
                url: `quotes/${id}`,
                method: 'PUT',
                body: { apocryphal }
            }),
            invalidatesTags: ['Quotes']
        }),
        deleteQuote: builder.mutation({
            query: (id) => ({
                url: `quotes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Quotes']
        })
    })
})

export const {
    useGetQuotesQuery,
    useCreateQuoteMutation,
    useToggleFakeMutation,
    useDeleteQuoteMutation
} = quotesApi