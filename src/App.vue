<script setup lang="ts">
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
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
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["books"] });
  },
});

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
    <span v-else-if="isError">Error: {{ error.message }}</span>
    <!-- We can assume by this point that `isSuccess === true` -->
    <ul v-else>
      <li v-for="book in data" :key="book.id">{{ book.title }}</li>
    </ul>
    <button @click="onButtonClick">Add book</button>
  </div>
</template>
