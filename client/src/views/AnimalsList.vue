<template>
  <div>
    <div class="card">
      <h2>Animals</h2>
      <p>Manage your veterinary clinic's animal records</p>
      
      <button @click="openAddAnimalModal" class="btn">
        Add New Animal
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
      <button @click="clearError" class="btn btn-secondary">Dismiss</button>
    </div>

    <div v-if="loading" class="loading">
      Loading animals...
    </div>

    <div v-else-if="animals.length === 0" class="card">
      <p>No animals found. Add your first animal to get started!</p>
    </div>

    <div v-else class="grid grid-3">
      <div
        v-for="animal in animals"
        :key="animal.id"
        class="animal-card"
      >
        <div @click="viewAnimal(animal.id)" style="cursor: pointer;">
          <h3>{{ animal.name }}</h3>
          <p><strong>Species:</strong> {{ animal.species }}</p>
          <p><strong>Age:</strong> {{ animal.age }} years</p>
          <p><strong>Birth Date:</strong> {{ formatDate(animal.birth_date) }}</p>
        </div>
        <button
          @click.stop="viewAnimal(animal.id)"
          class="btn"
          style="margin-top: 1rem; width: 100%; margin-bottom: 0.5rem;"
        >
          View Details
        </button>
        <button
          @click.stop="openEditAnimalModal(animal)"
          class="btn btn-secondary"
          style="width: 100%; margin-bottom: 0.5rem;"
        >
          Edit Animal
        </button>
        <button
          @click.stop="confirmDeleteAnimal(animal)"
          class="btn btn-danger"
          style="width: 100%;"
        >
          Delete Animal
        </button>
      </div>
    </div>

    <!-- Add Animal Modal -->
    <div v-if="showAddAnimalModal" class="modal" @click.self="closeAddAnimalModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Animal</h2>
          <button @click="closeAddAnimalModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="handleAddAnimal">
          <div class="form-group">
            <label for="name">Name *</label>
            <input 
              id="name"
              v-model="newAnimal.name" 
              type="text" 
              class="form-control" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="species">Species *</label>
            <input 
              id="species"
              v-model="newAnimal.species" 
              type="text" 
              class="form-control" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="birth_date">Birth Date *</label>
            <input 
              id="birth_date"
              v-model="newAnimal.birth_date" 
              type="date" 
              class="form-control" 
              required 
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn" :disabled="loading">
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
    <div v-if="showEditAnimalModal" class="modal" @click.self="closeEditAnimalModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Animal</h2>
          <button @click="closeEditAnimalModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="handleEditAnimal">
          <div class="form-group">
            <label for="edit-name">Name *</label>
            <input 
              id="edit-name"
              v-model="editAnimal.name" 
              type="text" 
              class="form-control" 
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
              required 
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn" :disabled="loading">
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
    <div v-if="showDeleteConfirmation" class="modal" @click.self="closeDeleteConfirmation">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button @click="closeDeleteConfirmation" class="close-btn">&times;</button>
        </div>

        <p style="margin-bottom: 1.5rem;">
          Are you sure you want to delete <strong>{{ animalToDelete?.name }}</strong>?
          This will also delete all associated events. This action cannot be undone.
        </p>

        <div class="form-actions">
          <button @click="closeDeleteConfirmation" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleDeleteAnimal" class="btn btn-danger" :disabled="loading">
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
  name: 'AnimalsList',
  setup() {
    const animalsStore = useAnimalsStore()
    const router = useRouter()
    const showDeleteConfirmation = ref(false)
    const animalToDelete = ref(null)

    const handleAddAnimal = async () => {
      try {
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
      editAnimal.value = {
        name: animal.name,
        species: animal.species,
        birth_date: animal.birth_date
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

    onMounted(async () => {
      console.log('AnimalsList mounted, fetching animals...')
      await animalsStore.fetchAnimals()
      console.log('Animals after fetch:', animalsStore.animals)
    })

    return {
      animals: computed(() => animalsStore.animals),
      loading: computed(() => animalsStore.loading),
      error: computed(() => animalsStore.error),
      showAddAnimalModal: computed(() => animalsStore.showAddAnimalModal),
      newAnimal: computed(() => animalsStore.newAnimal),
      showDeleteConfirmation,
      animalToDelete,
      showEditAnimalModal,
      editAnimal,
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
      clearError
    }
  }
}
</script>
