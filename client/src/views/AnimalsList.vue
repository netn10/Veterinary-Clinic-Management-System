<template>
  <div>
    <!-- Page Header -->
    <div class="page-header card">
      <h2>Animal Management</h2>
      <p class="text-secondary">Manage your veterinary clinic's animal records</p>
      <button @click="openAddAnimalModal" class="btn btn-primary">
        <span class="btn-icon">+</span>
        Add New Animal
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert error">
      <div>
        <strong>Error:</strong> {{ error }}
      </div>
      <button @click="clearError" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading animals...
    </div>

    <!-- Empty State -->
    <div v-else-if="animals.length === 0" class="card text-center">
      <div style="padding: var(--space-12) var(--space-8);">
        <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">No animals found</h3>
        <p style="margin-bottom: var(--space-6); color: var(--text-secondary);">
          Get started by adding your first animal to the system.
        </p>
        <button @click="openAddAnimalModal" class="btn btn-primary">
          <span class="btn-icon">+</span>
          Add Your First Animal
        </button>
      </div>
    </div>

    <!-- Animals Grid -->
    <div v-else class="grid grid-3">
      <div
        v-for="animal in animals"
        :key="animal.id"
        class="animal-card card-interactive"
        @click="viewAnimal(animal.id)"
        role="button"
        tabindex="0"
        @keydown.enter="viewAnimal(animal.id)"
        @keydown.space="viewAnimal(animal.id)"
      >
        <div class="animal-card-header">
          <h3>{{ animal.name }}</h3>
        </div>
        
        <div class="animal-card-info">
          <p>
            <strong>Species:</strong> 
            <span>{{ animal.species }}</span>
          </p>
          <p>
            <strong>Age:</strong> 
            <span>{{ animal.age }} years</span>
          </p>
          <p>
            <strong>Birth Date:</strong> 
            <span>{{ formatDate(animal.birth_date) }}</span>
          </p>
        </div>
        
        <div class="animal-card-actions">
          <button
            @click.stop="viewAnimal(animal.id)"
            class="btn btn-primary"
            :aria-label="`View details for ${animal.name}`"
          >
            View Details
          </button>
          <button
            @click.stop="openEditAnimalModal(animal)"
            class="btn btn-secondary"
            :aria-label="`Edit ${animal.name}`"
          >
            Edit Animal
          </button>
          <button
            @click.stop="confirmDeleteAnimal(animal)"
            class="btn btn-danger"
            :aria-label="`Delete ${animal.name}`"
          >
            Delete Animal
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="animals.length > 0"
      :current-page="animalsPagination.currentPage"
      :total-pages="animalsPagination.totalPages"
      :total-items="animalsPagination.totalItems"
      :items-per-page="animalsPagination.itemsPerPage"
      @page-change="handlePageChange"
    />

    <!-- Add Animal Modal -->
    <div v-if="showAddAnimalModal" class="modal" @click.self="closeAddAnimalModal" role="dialog" aria-labelledby="add-animal-title" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="add-animal-title">Add New Animal</h2>
          <button @click="closeAddAnimalModal" class="close-btn" aria-label="Close modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <form @submit.prevent="handleAddAnimal" role="form">
          <div class="form-group">
            <label for="name">Animal Name *</label>
            <input 
              id="name"
              v-model="newAnimal.name" 
              type="text" 
              class="form-control" 
              placeholder="Enter animal name"
              required 
              aria-describedby="name-help"
            />
            <small id="name-help" class="sr-only">Enter the name of the animal</small>
          </div>
          
          <div class="form-group">
            <label for="species">Species *</label>
            <input 
              id="species"
              v-model="newAnimal.species" 
              type="text" 
              class="form-control" 
              placeholder="e.g., Dog, Cat, Bird"
              required 
              aria-describedby="species-help"
            />
            <small id="species-help" class="sr-only">Enter the species of the animal</small>
          </div>
          
          <div class="form-group">
            <label for="birth_date">Birth Date *</label>
            <input
              id="birth_date"
              v-model="newAnimal.birth_date"
              type="date"
              class="form-control"
              :max="today"
              required
              aria-describedby="birth-date-help"
            />
            <small id="birth-date-help" class="sr-only">Enter the birth date of the animal</small>
          </div>
          
          <div class="form-actions form-actions-center">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
              {{ loading ? 'Adding...' : 'Add Animal' }}
            </button>
            <button type="button" @click="closeAddAnimalModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Animal Modal -->
    <div v-if="showEditAnimalModal" class="modal" @click.self="closeEditAnimalModal" role="dialog" aria-labelledby="edit-animal-title" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="edit-animal-title">Edit Animal</h2>
          <button @click="closeEditAnimalModal" class="close-btn" aria-label="Close modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <form @submit.prevent="handleEditAnimal" role="form">
          <div class="form-group">
            <label for="edit-name">Animal Name *</label>
            <input 
              id="edit-name"
              v-model="editAnimal.name" 
              type="text" 
              class="form-control" 
              placeholder="Enter animal name"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="edit-species">Species *</label>
            <input 
              id="edit-species"
              v-model="editAnimal.species" 
              type="text" 
              class="form-control" 
              placeholder="e.g., Dog, Cat, Bird"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="edit-birth_date">Birth Date *</label>
            <input
              id="edit-birth_date"
              v-model="editAnimal.birth_date"
              type="date"
              class="form-control"
              :max="today"
              required
            />
          </div>
          
          <div class="form-actions form-actions-center">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
              {{ loading ? 'Updating...' : 'Update Animal' }}
            </button>
            <button type="button" @click="closeEditAnimalModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="modal" @click.self="closeDeleteConfirmation" role="dialog" aria-labelledby="delete-animal-title" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="delete-animal-title">Confirm Delete</h2>
          <button @click="closeDeleteConfirmation" class="close-btn" aria-label="Close modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="alert error" style="margin-bottom: var(--space-6);">
          <div>
            <strong>Warning:</strong> Are you sure you want to delete <strong>{{ animalToDelete?.name }}</strong>?
            This will also delete all associated events. This action cannot be undone.
          </div>
        </div>

        <div class="form-actions form-actions-center">
          <button @click="closeDeleteConfirmation" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleDeleteAnimal" class="btn btn-danger" :disabled="loading">
            <span v-if="loading" aria-hidden="true" class="loading-spinner"></span>
            {{ loading ? 'Deleting...' : 'Delete Animal' }}
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
  name: 'AnimalsList',
  components: {
    Pagination
  },
  setup() {
    const animalsStore = useAnimalsStore()
    const router = useRouter()
    const showDeleteConfirmation = ref(false)
    const animalToDelete = ref(null)

    // Get today's date in YYYY-MM-DD format for date input max attribute
    const today = new Date().toISOString().split('T')[0]

    const handleAddAnimal = async () => {
      try {
        // Validate that birth_date is not in the future
        const birthDate = new Date(animalsStore.newAnimal.birth_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
          animalsStore.setError('Birth date cannot be in the future');
          return;
        }

        await animalsStore.addAnimal(animalsStore.newAnimal)
        animalsStore.setShowAddAnimalModal(false)
        animalsStore.setNewAnimal({ name: '', species: '', birth_date: '' })
      } catch (error) {
        // Error is handled in the store
      }
    }

    const viewAnimal = (id) => {
      router.push(`/animal/${id}`)
    }

    const openAddAnimalModal = () => {
      animalsStore.setShowAddAnimalModal(true)
    }

    const closeAddAnimalModal = () => {
      animalsStore.setShowAddAnimalModal(false)
      animalsStore.setNewAnimal({ name: '', species: '', birth_date: '' })
    }

    // Edit Animal functionality
    const showEditAnimalModal = ref(false)
    const editAnimal = ref({ name: '', species: '', birth_date: '' })
    const animalToEdit = ref(null)

    const openEditAnimalModal = (animal) => {
      animalToEdit.value = animal
      // Convert birth_date to YYYY-MM-DD format for date input
      const birthDate = new Date(animal.birth_date)
      const formattedDate = birthDate.toISOString().split('T')[0]
      editAnimal.value = {
        name: animal.name,
        species: animal.species,
        birth_date: formattedDate
      }
      showEditAnimalModal.value = true
    }

    const closeEditAnimalModal = () => {
      showEditAnimalModal.value = false
      animalToEdit.value = null
      editAnimal.value = { name: '', species: '', birth_date: '' }
    }

    const handleEditAnimal = async () => {
      try {
        // Validate that birth_date is not in the future
        const birthDate = new Date(editAnimal.value.birth_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
          animalsStore.setError('Birth date cannot be in the future');
          return;
        }

        await animalsStore.updateAnimal(animalToEdit.value.id, editAnimal.value)
        closeEditAnimalModal()
      } catch (error) {
        // Error is handled in the store
      }
    }

    const confirmDeleteAnimal = (animal) => {
      animalToDelete.value = animal
      showDeleteConfirmation.value = true
    }

    const closeDeleteConfirmation = () => {
      showDeleteConfirmation.value = false
      animalToDelete.value = null
    }

    const handleDeleteAnimal = async () => {
      if (!animalToDelete.value) return

      try {
        await animalsStore.deleteAnimal(animalToDelete.value.id)
        closeDeleteConfirmation()
      } catch (error) {
        // Error is handled in the store
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const clearError = () => {
      animalsStore.clearError()
    }

    const handlePageChange = async (page) => {
      await animalsStore.goToAnimalsPage(page)
    }

    onMounted(async () => {
      console.log('AnimalsList mounted, fetching animals...')
      await animalsStore.fetchAnimals()
      console.log('Animals after fetch:', animalsStore.animals)
    })

    return {
      animals: computed(() => animalsStore.animals),
      animalsPagination: computed(() => animalsStore.animalsPagination),
      loading: computed(() => animalsStore.loading),
      error: computed(() => animalsStore.error),
      showAddAnimalModal: computed(() => animalsStore.showAddAnimalModal),
      newAnimal: computed(() => animalsStore.newAnimal),
      showDeleteConfirmation,
      animalToDelete,
      showEditAnimalModal,
      editAnimal,
      today,
      handleAddAnimal,
      viewAnimal,
      openAddAnimalModal,
      openEditAnimalModal,
      closeEditAnimalModal,
      handleEditAnimal,
      closeAddAnimalModal,
      confirmDeleteAnimal,
      closeDeleteConfirmation,
      handleDeleteAnimal,
      formatDate,
      clearError,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
}

.page-header h2 {
  margin-bottom: var(--space-2);
}

.page-header p {
  margin-bottom: var(--space-6);
  color: var(--text-secondary);
}

.text-center {
  text-align: center;
}

.text-secondary {
  color: var(--text-secondary);
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
  .page-header {
    padding: var(--space-6);
  }
  
  .page-header h2 {
    font-size: var(--text-xl);
  }
}
</style>
