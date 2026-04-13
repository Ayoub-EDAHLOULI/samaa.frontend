"use client";

import "./UserPageTable.scss";
import React, { useEffect, useState, useCallback } from "react";
import { userService } from "@/services/user.service";
import { AdminUser, UsersListData } from "@/types/users.types";
import { Search, UserCog, Ban, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

function UserPageTable() {
  const { isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true);
        const result: UsersListData = await userService.getAll(
          pageNumber,
          pageSize,
        );
        setUsers(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalUsers(result.pagination.total);
      } catch {
        // silently fail — table stays empty
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    if (!authLoading) {
      fetchUsers(page);
    }
  }, [page, authLoading, fetchUsers]);

  // Client-side search filter on the current page
  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.role === "ADMIN") {
      Swal.fire(
        "Action Denied",
        "Cannot delete Admin users from this panel.",
        "warning",
      );
      return;
    }

    const result = await Swal.fire({
      title: `Delete "${user.displayName}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await userService.delete(user.id);
        Swal.fire("Deleted!", "User has been removed.", "success");
        fetchUsers(page);
      } catch {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  // Truncate UUID for display
  const shortId = (id: string) => id.slice(0, 8) + "…";

  // Map role to CSS class — ADMIN → "admin", USER → "user" (scss: .user = customer green)
  const roleClass = (role: string) => (role === "ADMIN" ? "admin" : "user");

  if (authLoading) {
    return <p className="loading-text">Authenticating…</p>;
  }

  return (
    <div className="admin-table-container">
      {/* Header */}
      <div className="admin-table-header">
        <div className="admin-table-title">
          <h2>Users</h2>
          <p className="admin-table-subtitle">
            Manage accounts, roles, and access permissions.
          </p>
        </div>
        <div className="admin-table-actions">
          <div className="admin-search-bar">
            <input
              type="text"
              placeholder="Search by name or email…"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading-text">Loading users…</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Recognitions</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="loading-text">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="id-cell" title={user.id}>
                      #{shortId(user.id)}
                    </td>

                    <td>
                      <div className="user-info-cell">
                        <div className="avatar-placeholder">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="details">
                          <span className="name">{user.displayName}</span>
                          <span className="email">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`role-badge ${roleClass(user.role)}`}>
                        {user.role === "ADMIN" ? <UserCog size={12} /> : null}
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.isEmailVerified ? (
                        <ShieldCheck size={16} color="#10b981" />
                      ) : (
                        <span style={{ color: "#a0a0a0", fontSize: "0.8rem" }}>
                          —
                        </span>
                      )}
                    </td>

                    <td className="date-cell">{user._count.recognitions}</td>

                    <td className="date-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user)}
                          title="Delete user"
                          disabled={user.role === "ADMIN"}
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages} <small>({totalUsers} users)</small>
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserPageTable;
