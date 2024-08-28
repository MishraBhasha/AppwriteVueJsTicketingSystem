<template>
    <layout-div>
        <AppLoader v-if="isLoading" />
        <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }"> Dashboard </h2>
        <div class="card">
            <div class="card-body">
                <div class="row justify-content-end">
                    <div class="col-md-4">
                        <input type="text" class="form-control" placeholder="search..." v-model="searchQuery"
                            @input="filterTickets">
                    </div>
                </div>
                <ul class="nav nav-underline">
                    <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                        <a class="nav-link m-2" :class="{ active: activeTab === tab.name }"
                            @click="setActiveTab(tab.name)" href="#">
                            {{ tab.label }}
                            <span class="badge bg-primary text-white rounded-pill">{{
                                allStatistic[tab.label.toUpperCase()] ?? 0 }}</span>
                        </a>
                    </li>
                </ul>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Ticket Name</th>
                            <th>Req-Date</th>
                            <th>Comment</th>
                            <th>Priority</th>
                            <th>Expected Delivery Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="8" class="text-center fs-5">No data available.</td>
                        </tr>
                        <tr v-for="(ticket, i) in paginatedData" :key="ticket.id">
                            <td>{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                            <td>{{ ticket.ticketName }}</td>
                            <td>{{ formatDate(ticket.createdOn) }}</td>
                            <td>{{ ticket.commentBox }}</td>
                            <td :class="getPriorityClass(ticket.priorityName)">
                                {{ ticket.priorityName }}
                            </td>
                            <td>{{ formatDate(ticket.expectedDeliveryDate) }}</td>
                            <td>
                                <span class="rounded-pill text-white p-1" :class="{
                                    'bg-warning': ticket.status.toLowerCase() === 'assigned',
                                    'bg-primary': ticket.status.toLowerCase() === 'submitted',
                                    'bg-secondary': ticket.status.toLowerCase() === 'generated',
                                    'bg-success': ticket.status.toLowerCase() === 'approved',
                                    'bg-dark': ticket.status.toLowerCase() === 'rejected',
                                    'bg-danger': ticket.status.toLowerCase() === 'cancelled'
                                }">{{ ticket.status }}
                                </span>
                            </td>
                            <td>
                                <a data-bs-toggle="modal" data-bs-target="#exampleModal" @click="openModal(ticket)">
                                    <i class="bi bi-pencil-fill text-primary mx-2"></i>
                                </a>
                                <i class="bi bi-trash3-fill text-danger" @click="handleDelete(ticket.id)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--Pagination-->
                <div class="d-flex justify-content-end mt-4" v-if="paginatedData.length > 0">
                     <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"
                                aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages"
                            :key="page">
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"
                                aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--Modal-->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Ticket Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Company Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.companyName" disabled readOnly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Address</label>
                                        <input type="text" class="form-control" id="field2"
                                            v-model="selectedTicket.address" disabled readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Person Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.personName" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control"
                                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" v-model="selectedTicket.phoneNumber"
                                            disabled readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Email Id</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.emailId" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Delivery Date</label>
                                        <input type="date" class="form-control" id="field2"
                                            v-model="selectedTicket.expectedDeliveryDate" disabled readonly />
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Status</label>
                                        <input type="text" class="form-control" v-model="selectedTicket.status" disabled
                                            readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">User Submission Date</label>
                                        <input type="text" :value="formattedUserSubmissionDate" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Ticket Type</label>
                                        <input type="text" v-model="selectedTicket.ticketName" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Priority Type</label>
                                        <input type="text" v-model="selectedTicket.priorityName" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Comment</label>
                                        <textarea rows="1" cols="20" id="commentBox" v-model="selectedTicket.commentBox"
                                            class="form-control" placeholder="Enter your comment here..." disabled
                                            readonly></textarea>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">User File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm"
                                                @click.prevent="downloadFile(selectedTicket.fileId)" target="_blank">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" v-if="activeTab === 'GENERATED'">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">Resolved File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm" target="_blank"
                                                @click.prevent="downloadResolvedFile(selectedTicket.resolvedFileId)">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form @submit.prevent="adminAssigned">
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="status">Status</label>
                                    <select class="form-select" v-model="status">
                                        <option value="" disabled selected>--select--</option>
                                        <option value="ASSIGNED" v-if="activeTab === 'SUBMITTED'">ASSIGN</option>
                                        <option value="APPROVED" v-if="activeTab === 'GENERATED'">APPROVE</option>
                                        <option value="REJECTED">REJECT</option>

                                    </select>
                                </div>
                                <div class="col-md-6" v-if="activeTab === 'SUBMITTED'">
                                    <label>Employee Name</label>
                                    <select class="form-select" v-model="assignedTo">
                                        <option value="" disabled selected>--select--</option>
                                        <option v-for="data in listOfEmployee" :key="data.id" :value="data.id">
                                            {{ data.firstName }} {{ data.lastName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="heading-container">
                                <h4>Comment Section</h4>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <label>Admin Comment</label>
                                    <textarea class="form-control" v-model="comment">

                                    </textarea>

                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
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
import AppLoader from '../pages/AppLoader.vue';
export default {
    name: 'TicketList',
    components: {
        LayoutDiv,
        AppLoader
    },
    data() {
        return {
            tickets: [],
            listOfEmployee: [],
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
            searchQuery: "",
            status: '',
            assignedTo: '',
            comment: '',
            allStatistic: {},
            isLoading: false,
            activeTab: 'SUBMITTED',
            tabs: [
                { name: 'SUBMITTED', label: 'SUBMITTED' },
                { name: 'ALL', label: 'ALL' },
                { name: 'ASSIGNED', label: 'ASSIGNED' },
                { name: 'GENERATED', label: 'GENERATED' },
                { name: 'APPROVED', label: 'APPROVED' },
                { name: 'REJECTED', label: 'REJECTED' },
                { name: 'CANCELLED', label: 'CANCELLED' },
            ],
            selectedTicket: {
                companyName: '',
                address: '',
                personName: '',
                phoneNumber: '',
                emailId: '',
                expectedDeliveryDate: '',
                status: '',
                createdOn: '',
                ticketName: '',
                priorityName: '',
                commentBox: '',
            },
        };
    },
    created() {
        this.fetchTicketList();
        this.getDashboardStatistics();
    },
    computed: {
        formattedUserSubmissionDate() {
            return this.formatDate(this.selectedTicket.createdOn);
        },
        formattedCreatedOn() {
            return this.formatDate(this.selectedTicket.createdOn);
        },
        filteredTickets() {
            const query = this.searchQuery.toLowerCase();
            return this.tickets.filter(ticket => {
                const matchesTab = this.activeTab === 'ALL' || ticket.status.toUpperCase() === this.activeTab;
                const matchesQuery = (
                    (ticket.companyName?.toLowerCase().includes(query) || '') ||
                    (ticket.address?.toLowerCase().includes(query) || '') ||
                    (ticket.personName?.toLowerCase().includes(query) || '') ||
                    (ticket.phoneNumber?.toLowerCase().includes(query) || '') ||
                    (ticket.emailId?.toLowerCase().includes(query) || '') ||
                    (ticket.ticketName?.toLowerCase().includes(query) || '') ||
                    (ticket.status?.toLowerCase().includes(query) || '') ||
                    (ticket.priorityName?.toLowerCase().includes(query) || '') || 
                    (ticket.commentBox?.toLowerCase().includes(query) || '')
                );
                return matchesTab && matchesQuery;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredTickets.slice(start, end);
        },
    },
    methods: {
        setActiveTab(tabName) {
            this.activeTab = tabName;
            this.currentPage = 1; // Reset to first page on tab change
            this.fetchTicketList();
            console.log(this.activeTab)
        },
        openModal(ticket) {
            this.selectedTicket = ticket;
            this.fetchEmployeeList();
        },
        closeModal() {
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
        },
        fetchTicketList() {
            axios.get('api/getRequestFormData')
                .then(response => {
                    this.tickets = response.data.data;
                    console.log(this.tickets)
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        fetchEmployeeList() {
            axios.get('api/getEmployeelist')
                .then(response => {
                    this.listOfEmployee = response.data.data;
                    console.log(this.listOfEmployee)
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`; // Format date as DD-MM-YYYY
        },
        handleDelete(id) {
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
                    axios.delete(`/api/fetchRequestFormRecordsByUserName/${id}`)
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Ticket deleted successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.fetchTicketList();
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
                        });
                }
            })
        },
        getPriorityClass(priorityName) {
            switch (priorityName) {
                case 'low':
                    return 'priority-low';
                case 'medium':
                    return 'priority-medium';
                case 'high':
                    return 'priority-high';
                default:
                    return '';
            }
        },
        downloadFile(fileId) {
            console.log(fileId)
            axios.get(`/api/downloadFile?fileId=${fileId}`, { responseType: 'blob' })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

                    const newTab = window.open(url, '_blank');
                    if (newTab) {
                        newTab.focus(); // Focus the new tab if it was successfully opened
                    } else {
                        console.error('Failed to open new tab');
                    }
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        downloadResolvedFile(fileId) {
            console.log(fileId)
            axios.get(`/api/downloadFile?fileId=${fileId}`, { responseType: 'blob' })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

                    const newTab = window.open(url, '_blank');
                    if (newTab) {
                        newTab.focus();
                    } else {
                        console.error('Failed to open new tab');
                    }
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        adminAssigned() {
            // this.isLoading = true;
            const payload = {
                status: this.status,
                assignedTo:  this.activeTab === 'GENERATED' ? 0 : this.assignedTo,
                comment: this.comment,
                requestFormCode: this.selectedTicket.requestFormCode,
                assignedBy: localStorage.getItem('userId')
            };

            Swal.fire({
                title: 'Please wait...',
                html: 'Submitting the form',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // this.isLoading = true;

            axios.all([
                axios.post('/api/saveRequestFormTrackingRecord', payload),
                axios.put(`/api/updateStatus?status=${payload.status}&id=${payload.requestFormCode}`)
            ])
                .then(axios.spread(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        text: `${payload.status} successfully.`,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {

                            this.closeModal();
                            this.fetchTicketList();
                            Swal.close();
                            this.getDashboardStatistics();
                        }
                    });
                }))
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'An error occurred!',
                        text: error.response.data.message,
                        showConfirmButton: true,
                        // timer: 1500
                    });
                })
                .finally(() => {
                    this.isLoading = false; // Hide loader
                });
        },
        getDashboardStatistics() {
            axios.get('api/getDashboardStatistics')
                .then(response => {
                    const statistic = response.data.data;
                    const obj = {
                        ...statistic,
                        ALL: response.data.val,
                    };
                    this.allStatistic = obj;
                    console.log(this.allStatistic)
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        // changePage(page) {
        //     if (page < 1 || page > this.totalPages) return;
        //     this.currentPage = page;
        //     this.fetchTicketList();
        // },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    },


};
</script>

<style scoped>
.nav-link.active {
    font-weight: bolder;
    color: #060389;
}

th {
    color: rgb(255, 255, 255);
    background-color: #060389;
}

.priority-low {
    font-weight: bold;
    color: rgb(189, 189, 8);
}

.priority-medium {
    font-weight: bold;
    color: rgb(14, 167, 78);
}

.priority-high {
    font-weight: bold;
    color: red;
}
</style>