<!-- src/components/PageNavigator.vue -->
<template>
    <nav aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: isFirstPage }">
          <button class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous" :disabled="isFirstPage">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: isLastPage }">
          <button class="page-link" @click="changePage(currentPage + 1)" aria-label="Next" :disabled="isLastPage">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      totalPages: {
        type: Number,
        required: true
      }
    },
    computed: {
      isFirstPage() {
        return this.currentPage === 1;
      },
      isLastPage() {
        return this.currentPage === this.totalPages;
      }
    },
    methods: {
      changePage(page) {
        this.$emit('page-changed', page);
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  