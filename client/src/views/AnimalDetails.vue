<template>
  <div>
    <div class="card animal-header">
      <div class="animal-info">
        <h2>{{ animal?.name || 'Loading...' }}</h2>
        <p v-if="animal"><strong>Species:</strong> {{ animal.species }} | <strong>Age:</strong> {{ animal.age }} years</p>
      </div>
      <div class="animal-actions">
        <button @click="goBack" class="btn btn-secondary">← Back to Animals</button>
        <button @click="exportData" class="btn btn-success" :disabled="loading">
          Export Excel
        </button>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
      <button @click="clearError" class="btn btn-secondary">Dismiss</button>
    </div>

    <div v-if="loading && !animal" class="loading">
      Loading animal details...
    </div>

    <div v-else-if="animal">
      <!-- Add Event Form -->
      <div class="card">
        <h3>Add New Event</h3>
        <form @submit.prevent="handleAddEvent">
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
              >
                <option value="">Select event type</option>
                <option value="Visit">Visit</option>
                <option value="Treatment">Treatment</option>
                <option value="Observation">Observation</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="event_date">Date *</label>
              <input
                id="event_date"
                v-model="newEvent.event_date"
                type="date"
                class="form-control date-input"
                :min="minDate"
                required
              />
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
              placeholder="Describe the event..."
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="clearEventForm" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? 'Adding...' : 'Add Event' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Events List -->
      <div class="card">
        <h3>Events History</h3>
        
        <div v-if="animal.events && animal.events.length === 0" class="loading">
          No events recorded yet. Add the first event above.
        </div>
        
        <div v-else>
          <div
            v-for="event in animal.events"
            :key="event.id"
            class="event-item"
          >
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <div class="event-type" :class="event.type">
                  {{ event.type }}
                </div>
                <p><strong>Date:</strong> {{ formatDate(event.event_date) }}</p>
                <p><strong>Description:</strong> {{ event.description }}</p>
              </div>
              <button
                @click="confirmDeleteEvent(event)"
                class="btn btn-danger"
                style="margin-left: 1rem; padding: 0.5rem 1rem; font-size: 0.75rem;"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Event Confirmation Modal -->
    <div v-if="showDeleteEventConfirmation" class="modal" @click.self="closeDeleteEventConfirmation">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button @click="closeDeleteEventConfirmation" class="close-btn">&times;</button>
        </div>

        <p style="margin-bottom: 1.5rem;">
          Are you sure you want to delete this <strong>{{ eventToDelete?.type }}</strong> event?
          This action cannot be undone.
        </p>

        <div class="form-actions">
          <button @click="closeDeleteEventConfirmation" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleDeleteEvent" class="btn btn-danger" :disabled="loading">
            {{ loading ? 'Deleting...' : 'Delete' }}
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

export default {
  name: 'AnimalDetails',
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

    onMounted(async () => {
      await animalsStore.fetchAnimalDetails(props.id)
    })

    return {
      animal: computed(() => animalsStore.currentAnimal),
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
      handleDeleteEvent
    }
  }
}
</script>
