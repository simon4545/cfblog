<template>
  <article class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
    <h3 class="text-lg font-semibold mb-1 leading-tight">
      <a :href="`/opencardonindex?id=${id}`" class="text-blue-700 hover:text-blue-900 hover:underline">{{ title }}</a>
    </h3>
    <div class="flex items-center gap-2 text-gray-500 text-xs mb-2">
      <span>{{ new Date(createdAt).toLocaleDateString() }}</span>
      <span>•</span>
      <span>By {{ author }}</span>
      <span v-if="category" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ category }}</span>
    </div>
    <div class="text-gray-700 text-sm leading-relaxed mb-3 flex-grow line-clamp-3" v-html="excerpt || content.substring(0, 150)"></div>
    <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
      <a :href="`/opencardonindex?id=${id}`" class="text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded text-sm no-underline transition-colors">Read More</a>
      <div v-if="isAdmin" class="flex items-center gap-2">
        <a :href="`/updatepostpg?id=${id}`" class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-sm hover:bg-amber-100 transition-colors no-underline">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </a>
        <button @click="handleDelete" class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Delete
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status?: string;
  category?: string | null;
  excerpt?: string;
  isAdmin?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
}>();

function handleDelete() {
  if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    emit('delete', props.id);
  }
}
</script>
