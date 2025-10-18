<template>
  <div>
    <!-- Animal Header -->
    <div class="card animal-header">
      <div class="animal-info">
        <h2>{{ animal?.name || 'Loading...' }}</h2>
        <div v-if="animal" class="animal-meta">
          <span class="meta-item">
            <strong>Species:</strong> {{ animal.species }}
          </span>
          <span class="meta-item">
            <strong>Age:</strong> {{ animal.age }} years
          </span>
          <span class="meta-item">
            <strong>Birth Date:</strong> {{ formatDate(animal.birth_date) }}
          </span>
        </div>
      </div>
      <div class="animal-actions">
        <button @click="goBack" class="btn btn-secondary">
          <span class="btn-icon">←</span>
          Back to Animals
        </button>
        <button @click="exportData" class="btn btn-success" :disabled="loading">
          <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
          <span class="btn-icon" v-else>📊</span>
          Export Excel
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert error">
      <div>
        <strong>Error:</strong> {{ error }}
      </div>
      <button @click="clearError" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !animal" class="loading">
      Loading animal details...
    </div>

    <div v-else-if="animal">
      <!-- Add Event Form -->
      <div class="card">
        <h3>Add New Event</h3>
        <p class="text-secondary">Record a new medical event or observation for {{ animal.name }}</p>
        
        <form @submit.prevent="handleAddEvent" role="form">
          <div class="grid grid-2">
            <div class="form-group">
              <label for="type">Event Type *</label>
              <select
                id="type"
                v-model="newEvent.type"
                class="form-control"
                :class="{ 'select-open': isSelectOpen }"
                @mousedown="isSelectOpen = !isSelectOpen"
                @blur="isSelectOpen = false"
                @change="isSelectOpen = false"
                required
                aria-describedby="type-help"
              >
                <option value="">Select event type</option>
                <option value="Visit">Visit</option>
                <option value="Treatment">Treatment</option>
                <option value="Observation">Observation</option>
              </select>
              <small id="type-help" class="sr-only">Select the type of event to record</small>
            </div>
            
            <div class="form-group">
              <label for="event_date">Event Date *</label>
              <input
                id="event_date"
                v-model="newEvent.event_date"
                type="date"
                class="form-control date-input"
                :min="minDate"
                required
                aria-describedby="date-help"
              />
              <small id="date-help" class="sr-only">Select the date when the event occurred</small>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description"
              v-model="newEvent.description" 
              class="form-control" 
              rows="3" 
              required
              placeholder="Describe the event in detail..."
              aria-describedby="description-help"
            ></textarea>
            <small id="description-help" class="sr-only">Provide a detailed description of the event</small>
          </div>
          
          <div class="form-actions form-actions-center">
            <button type="button" @click="clearEventForm" class="btn btn-secondary">
              Clear Form
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
              {{ loading ? 'Adding...' : 'Add Event' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Events List -->
      <div class="card">
        <h3>Events History</h3>
        <p class="text-secondary">Medical events and observations for {{ animal.name }}</p>
        
        <div v-if="animal.events && animal.events.length === 0" class="empty-state">
          <div style="padding: var(--space-12) var(--space-8); text-align: center;">
            <h4 style="margin-bottom: var(--space-4); color: var(--text-primary);">No events recorded yet</h4>
            <p style="color: var(--text-secondary);">Add the first event using the form above to start tracking medical history.</p>
          </div>
        </div>
        
        <div v-else>
          <div
            v-for="event in animal.events"
            :key="event.id"
            class="event-item"
          >
            <div class="event-header">
              <div class="event-content">
                <div class="event-type" :class="event.type">
                  {{ event.type }}
                </div>
                <div class="event-details">
                  <p>
                    <strong>Date: </strong> 
                    <span>{{ formatDate(event.event_date) }}</span>
                  </p>
                  <p>
                    <strong>Description: </strong> 
                    <span>{{ event.description }}</span>
                  </p>
                </div>
              </div>
              <button
                @click="confirmDeleteEvent(event)"
                class="btn btn-danger btn-sm"
                :aria-label="`Delete ${event.type} event from ${formatDate(event.event_date)}`"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <!-- Events Pagination -->
        <Pagination
          v-if="animal.events && animal.events.length > 0"
          :current-page="eventsPagination.currentPage"
          :total-pages="eventsPagination.totalPages"
          :total-items="eventsPagination.totalItems"
          :items-per-page="eventsPagination.itemsPerPage"
          @page-change="handleEventsPageChange"
        />
      </div>
    </div>

    <!-- Delete Event Confirmation Modal -->
    <div v-if="showDeleteEventConfirmation" class="modal" @click.self="closeDeleteEventConfirmation" role="dialog" aria-labelledby="delete-event-title" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="delete-event-title">Confirm Delete Event</h2>
          <button @click="closeDeleteEventConfirmation" class="close-btn" aria-label="Close modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="alert error" style="margin-bottom: var(--space-6);">
          <div>
            <strong>Warning:</strong> Are you sure you want to delete this <strong>{{ eventToDelete?.type }}</strong> event from {{ eventToDelete ? formatDate(eventToDelete.event_date) : '' }}?
            This action cannot be undone.
          </div>
        </div>

        <div class="form-actions form-actions-center">
          <button @click="closeDeleteEventConfirmation" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleDeleteEvent" class="btn btn-danger" :disabled="loading">
            <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
            {{ loading ? 'Deleting...' : 'Delete Event' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAnimalsStore } from '../stores/animals'
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'AnimalDetails',
  components: {
    Pagination
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const animalsStore = useAnimalsStore()
    const router = useRouter()
    const isSelectOpen = ref(false)
    const showDeleteEventConfirmation = ref(false)
    const eventToDelete = ref(null)
    const newEvent = ref({
      type: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0]
    })

    const handleAddEvent = async () => {
      try {
        await animalsStore.addEvent(props.id, newEvent.value)
        newEvent.value = {
          type: '',
          description: '',
          event_date: new Date().toISOString().split('T')[0]
        }
      } catch (error) {
        // Error is handled in the store
      }
    }

    const clearEventForm = () => {
      newEvent.value = {
        type: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0]
      }
    }

    const exportData = async () => {
      try {
        await animalsStore.exportAnimalData(props.id)
      } catch (error) {
        // Error is handled in the store
      }
    }

    const goBack = () => {
      router.push('/')
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const clearError = () => {
      animalsStore.clearError()
    }

    const minDate = computed(() => {
      return new Date().toISOString().split('T')[0]
    })

    const confirmDeleteEvent = (event) => {
      eventToDelete.value = event
      showDeleteEventConfirmation.value = true
    }

    const closeDeleteEventConfirmation = () => {
      showDeleteEventConfirmation.value = false
      eventToDelete.value = null
    }

    const handleDeleteEvent = async () => {
      if (!eventToDelete.value) return

      try {
        await animalsStore.deleteEvent(props.id, eventToDelete.value.id)
        closeDeleteEventConfirmation()
      } catch (error) {
        // Error is handled in the store
      }
    }

    const handleEventsPageChange = async (page) => {
      await animalsStore.goToEventsPage(page)
    }

    onMounted(async () => {
      await animalsStore.fetchAnimalDetails(props.id)
    })

    return {
      animal: computed(() => animalsStore.currentAnimal),
      eventsPagination: computed(() => animalsStore.eventsPagination),
      loading: computed(() => animalsStore.loading),
      error: computed(() => animalsStore.error),
      isSelectOpen,
      showDeleteEventConfirmation,
      eventToDelete,
      newEvent,
      handleAddEvent,
      clearEventForm,
      exportData,
      goBack,
      formatDate,
      clearError,
      minDate,
      confirmDeleteEvent,
      closeDeleteEventConfirmation,
      handleDeleteEvent,
      handleEventsPageChange
    }
  }
}
</script>

<style scoped>
.animal-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.meta-item {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.meta-item strong {
  color: var(--text-primary);
  font-weight: 600;
}

.text-secondary {
  color: var(--text-secondary);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-8);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  font-weight: 500;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin-right: var(--space-2);
}

@media (max-width: 768px) {
  .animal-meta {
    gap: var(--space-1);
  }
  
  .meta-item {
    font-size: var(--text-xs);
  }
}
</style>
