<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Manager</h2>
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
                            <th>Expected_Delivery-Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="8" class="text-center fs-5">No data available.</td>
                        </tr>
                        <tr v-for="(ticket, i) in paginatedData" :key="ticket.id">
                            <!-- <tr v-for="(ticket, i) in tickets" :key="ticket.id"> -->
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
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Company Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.companyName" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Address</label>
                                        <input type="text" class="form-control" id="field2"
                                            v-model="selectedTicket.address" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Person Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.personName" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control"
                                            v-model="selectedTicket.phoneNumber" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Email Id</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.emailId" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Delivery Date</label>
                                        <input type="date" class="form-control" id="field2"
                                            v-model="selectedTicket.expectedDeliveryDate" disabled readonly />
                                    </div>
                                </div>

                                <div class="col-md-4 mb-2">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Status</label>
                                        <input type="text" class="form-control" v-model="selectedTicket.status" disabled
                                            readonly />
                                    </div>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Ticket Type</label>
                                        <input type="text" v-model="selectedTicket.ticketName" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Priority Type</label>
                                        <input type="text" v-model="selectedTicket.priorityName" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Comment</label>
                                        <textarea rows="1" cols="20" id="commentBox" v-model="selectedTicket.commentBox"
                                            class="form-control" placeholder="Enter your comment here..." disabled
                                            readonly></textarea>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-2">
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
                                <div class="col-md-3 mb-2" v-if="activeTab === 'GENERATED'">
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
                                <div class="col-md-3 mb-2">
                                    <button type="submit" class="btn btn-primary m-3"
                                        @click.prevent="resolveIssue(selectedTicket.requestFormCode)">Resolve
                                        Issue</button>
                                </div>
                            </div>
                        </form>
                        <div class="modal-footer mt-2"></div>
                        <form @submit.prevent="update">
                            <div class="heading-container">
                                <h4>Comment Section</h4>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-2">
                                    <label>Employee Comment</label>
                                    <textarea class="form-control" v-model="comment">
                                        </textarea>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
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
export default {
    name: 'TicketList',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            tickets: [],
            activeTab: 'ALL',
            currentPage: 1,
            itemsPerPage: 5,
            searchQuery: '',
            comment:'',
            tabs: [
                { name: 'ALL', label: 'ALL' },
                { name: 'ASSIGNED', label: 'ASSIGNED' },
                { name: 'GENERATED', label: 'GENERATED' },
                { name: 'APPROVED', label: 'APPROVED' },
                { name: 'REJECTED', label: 'REJECTED' },
                { name: 'CANCELLED', label: 'CANCELLED' },
            ],
            selectedTicket: {},
            allStatistic: {}
        };
    },
    created() {
        this.fetchTicketList();
        this.getDashboardStatistics();
    },
    computed: {
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
                    (ticket.priorityName?.toLowerCase().includes(query) || '')
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
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        openModal(ticket) {
            this.selectedTicket = ticket;
            this.fetchTicketList();
            // this.fetchEmployeeList();
        },
        update() {
            const payload = {
                adminId: this.selectedTicket.adminId || 0,
                comment: this.selectedTicket.comment || 'resolved',
                employeeId: this.selectedTicket.employeeId || localStorage.getItem('userId'),
                requestFormCode: this.selectedTicket.requestFormCode,
                role: this.selectedTicket.role || 'Employee'
            };

            console.log(payload);

            // Sending the payload using axios.put
            axios.post('/api/saveComment', payload)
                .then(response => {
                    console.log(response);
                    this.fetchTicketList();
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated',
                        text: 'The ticket was updated successfully',
                    }).then(() => {
                        const modalElement = document.getElementById('exampleModal');
                        const modalInstance = Modal.getInstance(modalElement);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.parentNode.removeChild(backdrop);
                        }
                        this.fetchTicketList();
                    });
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was a problem updating the ticket',
                    });
                });
        },
        // update() {
        //     console.log(this.selectedTicket)
        //     axios.put(`/api/updateRequestFormData`, this.selectedTicket)
        //         .then(response => {
        //             console.log(response);
        //             this.fetchTicketList();
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'Updated',
        //                 text: 'The ticket was updated successfully',
        //             }).then(() => {
        //                 const modalElement = document.getElementById('exampleModal');
        //                 const modalInstance = Modal.getInstance(modalElement);
        //                 modalInstance.hide();
        //                 const backdrop = document.querySelector('.modal-backdrop');
        //                 if (backdrop) {
        //                     backdrop.parentNode.removeChild(backdrop);
        //                 }
        //                 this.fetchTicketList();
        //             });

        //         })
        //         .catch(error => {
        //             console.log(error);
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'Error',
        //                 text: 'There was a problem updating the ticket',
        //             });
        //         });
        // },
        resolveIssue(id) {
            const requestUrl = `/api/updateTicketDetails?requestFormCode=${id}`;

            axios.put(requestUrl)
                .then(response => {
                    const statistic = response.data.data;
                    console.log(statistic);
                    // Swal alert for success
                    Swal.fire({
                        icon: 'success',
                        title: 'Resolved',
                        text: 'The ticket was resolved successfully',
                    });

                    return response;
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was a problem resolving the ticket',
                    });
                    return error;
                });
        },

        //         resolveIssue(id) {
        //     axios.put('/api/updateTicketDetails', {
        //         params: {
        //             requestFormCode: id
        //         }
        //     })
        //     .then(response => {
        //         const statistic = response.data.data;
        //         console.log(statistic);
        //         // Swal alert for success
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Resolved',
        //             text: 'The ticket was resolved successfully',
        //         });

        //         return response;
        //     })
        //     .catch(error => {
        //         console.error(error);
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Error',
        //             text: 'There was a problem resolving the ticket',
        //         });
        //         return error;
        //     });
        // },

        //         resolveIssue(id) {
        //         const payload = {
        //         requestFormCode: id
        //     };

        //     axios.post('/api/updateTicketDetails', payload)
        //         .then(response => {
        //             const statistic = response.data.data;
        //             console.log(statistic);
        //             // Swal alert for success
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'Resolved',
        //                 text: 'The ticket was resolved successfully',
        //             });

        //             return response;
        //         })
        //         .catch(error => {
        //             console.error(error);
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'Error',
        //                 text: 'There was a problem resolving the ticket',
        //             });
        //             return error;
        //         });
        // },

        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`; // Format date as YYYY-MM-DD
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
        }
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