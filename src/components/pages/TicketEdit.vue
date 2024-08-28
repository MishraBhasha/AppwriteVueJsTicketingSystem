<template>
<layout-div>
<h2 class="text-center mt-5 mb-3">Edit Ticket</h2>
<div class="card">
<div class="card-header">
<router-link 
                    class="btn btn-outline-info float-right"
                    to="/">View All Tickets
</router-link>
</div>
<div class="card-body">
<form>
<div class="form-group">
<label htmlFor="name">Name</label>
<input 
                            v-model="Ticket.name"
                            type="text"
                            class="form-control"
                            id="name"
                            name="name"/>
</div>
<div class="form-group">
<label htmlFor="description">Description</label>
<textarea 
                            v-model="Ticket.description"
                            class="form-control"
                            id="description"
                            rows="3"
                            name="description"></textarea>
</div>
<button 
                        @click="handleSave()"
                        :disabled="isSaving"
                        type="button"
                        class="btn btn-outline-primary mt-3">
                        Save Ticket
</button>
</form>
</div>
</div>
</layout-div>
</template>
<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
export default {
  name: 'TicketEdit',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      Ticket: {
        name: '',
        description: '',
      },
      isSaving:false,
    };
  },
  created() {
    const id = this.$route.params.id;
    axios.get(`/api/Tickets/${id}`)
    .then(response => {
        let TicketInfo = response.data
        this.Ticket.name = TicketInfo.name
        this.Ticket.description = TicketInfo.description
        return response
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'An Error Occured!',
            showConfirmButton: false,
            timer: 1500
        })
        return error
    })
  },
  methods: {
    handleSave() {
        this.isSaving = true
        const id = this.$route.params.id;
        axios.patch(`/api/Tickets/${id}`, this.Ticket)
          .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Ticket updated successfully!',
                showConfirmButton: false,
                timer: 1500
            })
            this.isSaving = false
            this.Ticket.name = ""
            this.Ticket.description = ""
            return response
          })
          .catch(error => {
            this.isSaving = false
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
            })
            return error
          });
    },
  },
};
</script>