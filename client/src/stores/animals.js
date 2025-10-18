import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from './toast'

export const useAnimalsStore = defineStore('animals', {
  state: () => ({
    animals: [],
    currentAnimal: null,
    loading: false,
    error: null,
    showAddAnimalModal: false,
    newAnimal: {
      name: '',
      species: '',
      birth_date: ''
    }
  }),

  actions: {
    async fetchAnimals() {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching animals from /api/animals...')
        const response = await axios.get('/api/animals')
        console.log('Response received:', response.data)
        this.animals = response.data
        console.log('Animals set in store:', this.animals)
      } catch (error) {
        this.error = 'Failed to fetch animals'
        console.error('Error fetching animals:', error)
      } finally {
        this.loading = false
      }
    },

    async addAnimal(animalData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/animals', animalData)
        this.animals.push(response.data)
        const toastStore = useToastStore()
        toastStore.success(`${response.data.name} has been added successfully!`)
        return response.data
      } catch (error) {
        this.error = 'Failed to add animal'
        console.error('Error adding animal:', error)
        const toastStore = useToastStore()
        toastStore.error('Failed to add animal')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAnimal(animalId, animalData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`/api/animals/${animalId}`, animalData)
        // Update the animal in the local state
        const index = this.animals.findIndex(a => a.id === animalId)
        if (index !== -1) {
          this.animals[index] = response.data
        }
        const toastStore = useToastStore()
        toastStore.success(`${response.data.name} has been updated successfully!`)
        return response.data
      } catch (error) {
        this.error = 'Failed to update animal'
        console.error('Error updating animal:', error)
        const toastStore = useToastStore()
        toastStore.error('Failed to update animal')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAnimalDetails(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/api/animals/${id}`)
        this.currentAnimal = response.data
        return response.data
      } catch (error) {
        this.error = 'Failed to fetch animal details'
        console.error('Error fetching animal details:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addEvent(animalId, eventData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`/api/animals/${animalId}/events`, eventData)
        if (this.currentAnimal && this.currentAnimal.id === parseInt(animalId)) {
          // Ensure events array exists
          if (!this.currentAnimal.events) {
            this.currentAnimal.events = []
          }
          // Add the new event at the beginning of the array (most recent first)
          this.currentAnimal.events.unshift(response.data)
        }
        const toastStore = useToastStore()
        toastStore.success(`${eventData.type} event has been added successfully!`)
        return response.data
      } catch (error) {
        this.error = 'Failed to add event'
        console.error('Error adding event:', error)
        const toastStore = useToastStore()
        toastStore.error('Failed to add event')
        throw error
      } finally {
        this.loading = false
      }
    },

    async exportAnimalData(animalId) {
      try {
        const response = await axios.get(`/api/animals/${animalId}/export`, {
          responseType: 'blob'
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        // Get animal name for filename
        const animal = this.animals.find(a => a.id === animalId)
        const filename = animal ? `${animal.name}_events_report.xlsx` : 'animal_events_report.xlsx'
        link.setAttribute('download', filename)

        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        this.error = 'Failed to export data'
        console.error('Error exporting data:', error)
        throw error
      }
    },

    async deleteAnimal(animalId) {
      this.loading = true
      this.error = null
      try {
        const animal = this.animals.find(a => a.id === animalId)
        await axios.delete(`/api/animals/${animalId}`)
        // Remove the animal from the local state
        this.animals = this.animals.filter(a => a.id !== animalId)
        const toastStore = useToastStore()
        toastStore.success(`${animal?.name || 'Animal'} has been deleted successfully!`)
        return true
      } catch (error) {
        this.error = 'Failed to delete animal'
        console.error('Error deleting animal:', error)
        const toastStore = useToastStore()
        toastStore.error('Failed to delete animal')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(animalId, eventId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/api/animals/${animalId}/events/${eventId}`)
        // Remove the event from the current animal's events
        if (this.currentAnimal && this.currentAnimal.id === parseInt(animalId)) {
          this.currentAnimal.events = this.currentAnimal.events.filter(e => e.id !== eventId)
        }
        const toastStore = useToastStore()
        toastStore.success('Event has been deleted successfully!')
        return true
      } catch (error) {
        this.error = 'Failed to delete event'
        console.error('Error deleting event:', error)
        const toastStore = useToastStore()
        toastStore.error('Failed to delete event')
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    setShowAddAnimalModal(value) {
      this.showAddAnimalModal = value
    },

    setNewAnimal(animal) {
      this.newAnimal = animal
    }
  }
})
