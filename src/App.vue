<script setup lang="ts">
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import type { Book } from "./api";
import api from "./api";

// Access QueryClient instance
const queryClient = useQueryClient();

// Query
const { isPending, isError, data, error } = useQuery({
  queryKey: ["books"],
  queryFn: api.books.list,
});

// Mutation
const mutation = useMutation({
  mutationFn: api.books.add,

  onMutate: async (newBook) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ["books"] });

    // Snapshot the previous value
    const previousBooks = queryClient.getQueryData(["books"]);

    // Optimistically update to the new value
    queryClient.setQueryData(["books"], (old: Book[]) => [...old, newBook]);

    // Return a context object with the snapshotted value
    return { previousBooks };
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (_err, _newBook, context) => {
    if (context) {
      queryClient.setQueryData(["books"], context.previousBooks);
    }
  },

  onSettled: async () => {
    return await queryClient.invalidateQueries({ queryKey: ["books"] });
  },
});

const { variables, isError: isMutationError } = mutation;

function onButtonClick() {
  mutation.mutate({
    id: Math.floor(Math.random() * 100),
    title: "Mouthful of Birds",
    author: "Samanta Schweblin",
    publishedYear: 2009,
  });
}
</script>

<template>
  <div>
    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError">Error: {{ error!.message }}</span>
    <!-- We can assume by this point that `isSuccess === true` -->
    <ul v-else>
      <li v-for="book in data" :key="book.id">{{ book.title }}</li>
    </ul>

    <template v-if="isMutationError">
      <button @click="variables && mutation.mutate(variables)">Retry</button>
    </template>
    <template v-else>
      <button @click="onButtonClick">Add book</button>
    </template>
  </div>
</template>
