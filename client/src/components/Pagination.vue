<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
    </div>
    
    <div class="pagination-controls">
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="btn btn-secondary btn-sm"
        :class="{ disabled: currentPage <= 1 }"
      >
        Previous
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="btn btn-sm"
          :class="{
            'btn-primary': page === currentPage,
            'btn-secondary': page !== currentPage
          }"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="btn btn-secondary btn-sm"
        :class="{ disabled: currentPage >= totalPages }"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const startItem = computed(() => {
      return (props.currentPage - 1) * props.itemsPerPage + 1
    })
    
    const endItem = computed(() => {
      const end = props.currentPage * props.itemsPerPage
      return Math.min(end, props.totalItems)
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      const half = Math.floor(maxVisible / 2)
      
      let start = Math.max(1, props.currentPage - half)
      let end = Math.min(props.totalPages, start + maxVisible - 1)
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })
    
    const goToPage = (page) => {
      if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('page-change', page)
      }
    }
    
    return {
      startItem,
      endItem,
      visiblePages,
      goToPage
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  margin-top: var(--space-6);
  padding: var(--space-4);
}

.pagination-info {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.page-numbers {
  display: flex;
  gap: var(--space-1);
}

.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn.disabled:hover {
  background-color: var(--btn-secondary-bg);
  color: var(--btn-secondary-color);
}

@media (max-width: 768px) {
  .pagination {
    gap: var(--space-3);
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    order: 1;
    width: 100%;
    justify-content: center;
    margin: var(--space-2) 0;
  }
  
  .pagination-controls .btn:not(.page-numbers .btn) {
    order: 2;
  }
}
</style>
