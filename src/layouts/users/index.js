import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { API } from "api";
import { URL } from "constants/userconstants";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import AddUserModal from "components/users/AddUserModal";
import EditUserModal from "components/users/EditUserModal";
import ConfirmDialog from "components/ConfirmDeteteDialog";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get(`${URL}/admin/users`); // Update endpoint as needed
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = async (userId) => {
    try {
      await API.delete(`${URL}/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleAddUser = async (user) => {
    try {
      await API.post(`${URL}/admin/users`, user);
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const handleEditUser = async (user) => {
    try {
      await API.put(`${URL}/admin/users/${user._id}`, user);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredUsers.map((u, i) => ({
    index: i+1,
    name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.username}
      </MDTypography>
    ),
    email: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.email}
      </MDTypography>
    ),
    createdAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.createdAt}
      </MDTypography>
    ),
    role: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.role}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        <MDButton
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleSelectUser(u)}
        >
          Edit
        </MDButton>
        <MDButton
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(u)}
        >
          Delete
        </MDButton>
      </MDBox>
    ),
  }));

  const columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Created At", accessor: "createdAt", align: "left", sortable: true },
    { Header: "Role", accessor: "role", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h5">Users</MDTypography>
          <MDButton variant="gradient" color="info" onClick={() => setCreateOpen(true)}>
            Add User
          </MDButton>
        </MDBox>
        <MDBox mb={2}>
          <MDBox display="flex" justifyContent="flex-end">
            <input
              type="text"
              placeholder="Search by name, email, or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 220 }}
            />
          </MDBox>
        </MDBox>
        <MDBox pt={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={true}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
        </MDBox>
        <AddUserModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSave={handleAddUser}
        />
        <EditUserModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          userData={selectedUser}
          onUpdate={handleEditUser}
        />
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete User"
          content={`Are you sure you want to delete user ${selectedUser?.username}?`}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default UsersList;
