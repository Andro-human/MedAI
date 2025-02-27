import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_APP_BASEURL}` }),
  tagTypes: ["Conversation", "User"], // tags are used to refetch data when a mutation is performed

  endpoints: (builder) => ({
    myConversations: builder.query({
      query: () => ({
        url: "api/v1/conversations/my",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `api/v1/users/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    conversationDetails: builder.query({
      query: ({ conversationId, populate = false }) => {
        let url = `api/v1/conversations/${conversationId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Conversation"],
    }),

    getMessages: builder.query({
      query: ({ conversationId, page = 1 }) => ({
        url: `api/v1/message/${conversationId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useMyConversationsQuery,
  useLazySearchUserQuery,
  useConversationDetailsQuery,
  useGetMessagesQuery,
} = api;
