<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Show Ticket</h2>
    <div class="card">
      <div class="card-header">
        <router-link class="btn btn-outline-info float-right" to="/">
          View All Tickets
        </router-link>
      </div>
      <div class="card-body">
        <b className="text-muted">Name:</b>
        <p>{{ Ticket.name }}</p>
        <b className="text-muted">Description:</b>
        <p>{{ Ticket.description }}</p>
      </div>
    </div>
  </layout-div>
</template>
<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
export default {
  name: 'TicketShow',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      Ticket: {
        name: '',
        description: '',
      },
      isSaving: false,
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
  },
};
</script>