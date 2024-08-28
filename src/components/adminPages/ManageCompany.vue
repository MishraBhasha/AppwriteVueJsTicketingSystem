<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Company List</h2>
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-between mb-3">
            <div class="col-md-4">
              <button type="button" class="btn btn-outline-primary" @click="openModal()">Create Company</button>
            </div>
            <div class="col-md-4">
              <input type="text" class="form-control" placeholder="search..." v-model="searchQuery"
                @input="filterTickets">
            </div>
          </div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedCompanies.length === 0">
                <td colspan="5" class="text-center fs-5">No data available.</td>
              </tr>
              <tr v-for="(company, index) in paginatedCompanies" :key="company.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ company.name }}</td>
                <td>{{ company.email }}</td>
                <td>{{ company.phone }}</td>
                <td>
                  <button @click="openModal(company)" class="btn btn-outline-info mx-1">Edit</button>
                  <i class="bi bi-trash3-fill text-danger" @click="deleteCompany(company.id)"></i>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-end mt-4" v-if="paginatedCompanies.length > 0">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages" :key="page">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Company Modal -->
    <div class="modal fade" id="editCompanyModal" tabindex="-1" aria-labelledby="editCompanyModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCompanyModalLabel">{{ isEditing ? 'Edit Company' : 'Create Company' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateCompany() : createCompany()">
              <div class="mb-3">
                <label for="companyName" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" v-model="selectedCompany.name" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="selectedCompany.email" required>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="phone" v-model="selectedCompany.phone" required>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Create' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </layout-div>
</template>


<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

export default {
  name: 'CompanyList',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      companies: [],
      selectedCompany: {
        id: '',
        name: '',
        email: '',
        phone: '',
      },
      isEditing: false,
      currentPage: 1,
      itemsPerPage: 5,
      searchQuery: '',
    };
  },
  created() {
    this.fetchCompanyList();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.companies.length / this.itemsPerPage);
    },
    paginatedCompanies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.companies.slice(start, end);
    },
  },
  methods: {
    filteredTickets() {
      const query = this.searchQuery.toLowerCase();
      return this.companies.filter(company => {
        const matchesQuery = (
          (company.name?.toLowerCase().includes(query) || '')
        );
        return matchesQuery;
      });
    },
    fetchCompanyList() {
      axios.get('/api/getCompanylist')
        .then(response => {
          this.companies = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching companies:', error);
        });
    },
    openModal(company = null) {
      if (company) {
        this.selectedCompany = { ...company };
        this.isEditing = true;
      } else {
        this.selectedCompany = {
          id: '',
          name: '',
          email: '',
          phone: '',
        };
        this.isEditing = false;
      }
      const modal = new Modal(document.getElementById('editCompanyModal'));
      modal.show();
    },
    closeModal() {
      const modalElement = document.getElementById('editCompanyModal');
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance.hide();
    },
    createCompany() {
      axios.post('/api/saveCompanyDetails', this.selectedCompany)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Created',
            text: 'The company was created successfully',
          }).then(() => {
            this.fetchCompanyList();
            this.closeModal();
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'There was a problem creating the company',
          });
        });
    },
    updateCompany() {
      axios.put(`/api/updateCompanyDetails/${this.selectedCompany.id}`, this.selectedCompany)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Updated',
            text: 'The company was updated successfully',
          }).then(() => {
            this.fetchCompanyList();
            this.closeModal();
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'There was a problem updating the company',
          });
        });
    },
    deleteCompany(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/deleteCompanyDetails/${id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Company deleted successfully!',
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchCompanyList(); // Refresh list after deletion
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'An Error Occurred!',
                showConfirmButton: false,
                timer: 1500
              });
              console.error('Error deleting company:', error);
            });
        }
      });
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>


<style scoped>
th {
  color: rgb(255, 255, 255);
  background-color: #060389;
}

.text-danger {
  cursor: pointer;
}

.table-bordered {
  border: 1px solid #dee2e6;
}
</style>