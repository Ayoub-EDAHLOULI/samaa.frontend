"use client";

import "./ReciterPageTable.scss";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { reciterService } from "@/services/reciter.service";
import { Reciter, PaginatedReciters } from "@/types/reciters.types";
import { Search, Plus, Pencil, Trash2, Mic, Eye } from "lucide-react";
import Swal from "sweetalert2";
import ReciterFormModal from "../ReciterFormModal/ReciterFormModal";
import ReciterViewModal from "../ReciterViewModal/ReciterViewModal";
import fullImageUrl from "@/utils/fullImageUrl";

function ReciterPageTable() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReciters, setTotalReciters] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeReciter, setActiveReciter] = useState<Reciter | null>(null);

  const fetchReciters = useCallback(
    async (pageNumber: number, search?: string) => {
      try {
        setLoading(true);
        const result: PaginatedReciters = await reciterService.getPaginated(
          pageNumber,
          pageSize,
          search,
        );
        setReciters(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalReciters(result.pagination.total);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchReciters(page, searchTerm || undefined);
  }, [page, fetchReciters, searchTerm]);

  // Debounced server-side search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchReciters(1, searchTerm || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchReciters]);

  const openCreate = () => {
    setActiveReciter(null);
    setEditModalOpen(true);
  };

  const openEdit = (reciter: Reciter) => {
    setActiveReciter(reciter);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const openView = (reciter: Reciter) => {
    setActiveReciter(reciter);
    setViewModalOpen(true);
  };

  const handleEditSave = () => {
    const wasEdit = activeReciter !== null;
    setEditModalOpen(false);
    fetchReciters(page, searchTerm || undefined);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: wasEdit ? "Reciter updated." : "Reciter added.",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleDelete = async (reciter: Reciter) => {
    const displayName = reciter.translation?.name ?? reciter.slug;
    const result = await Swal.fire({
      title: `Delete "${displayName}"?`,
      html:
        reciter.totalDiscoveries > 0
          ? `<span style="color:#f87171">This reciter has <strong>${reciter.totalDiscoveries}</strong> recognition(s) in user history — the backend will block this delete.</span>`
          : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await reciterService.delete(reciter.id);
      setReciters((prev) => prev.filter((r) => r.id !== reciter.id));
      setTotalReciters((n) => n - 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Reciter deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete reciter.";
      Swal.fire("Cannot Delete", msg, "error");
    }
  };

  const shortId = (id: string) => id.slice(0, 8) + "…";

  return (
    <>
      <div className="admin-table-container">
        {/* Header */}
        <div className="admin-table-header">
          <div className="admin-table-title">
            <h2>Reciters</h2>
            <p className="admin-table-subtitle">
              Manage the reciter database — add, edit, or remove entries.
            </p>
          </div>
          <div className="admin-table-actions">
            <div className="admin-search-bar">
              <input
                type="text"
                placeholder="Search by name or nationality…"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" />
            </div>
            <button className="btn-add" onClick={openCreate}>
              <Plus size={16} />
              Add Reciter
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="loading-text">Loading reciters…</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reciter</th>
                  <th>Nationality</th>
                  <th>Country</th>
                  <th>Discoveries</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reciters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="loading-text">
                      No reciters found.
                    </td>
                  </tr>
                ) : (
                  reciters.map((reciter) => (
                    <tr
                      key={reciter.id}
                      className="clickable-row"
                      onClick={() => openView(reciter)}
                    >
                      <td className="id-cell" title={reciter.id}>
                        #{shortId(reciter.id)}
                      </td>

                      <td>
                        <div className="reciter-info-cell">
                          <div className="reciter-avatar">
                            {reciter.imageUrl ? (
                              <Image
                                src={fullImageUrl(reciter.imageUrl)}
                                alt={reciter.translation?.name ?? reciter.slug}
                                width={36}
                                height={36}
                                className="avatar-img"
                                unoptimized
                              />
                            ) : (
                              <Mic size={16} className="avatar-icon" />
                            )}
                          </div>
                          <div className="reciter-details">
                            <span className="name">
                              {reciter.translation?.name ?? (
                                <span className="muted">{reciter.slug}</span>
                              )}
                            </span>
                            <span className="slug">{reciter.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="nationality-cell">
                        {reciter.translation?.nationality ?? (
                          <span className="muted">—</span>
                        )}
                      </td>

                      <td className="nationality-cell">
                        {reciter.countryCode ? (
                          <span className="country-code">
                            {reciter.countryCode.toUpperCase()}
                          </span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>

                      <td className="stat-cell">
                        {reciter.totalDiscoveries.toLocaleString()}
                      </td>

                      <td className="date-cell">
                        {new Date(reciter.createdAt).toLocaleDateString()}
                      </td>

                      <td
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="actions">
                          <button
                            className="btn-view"
                            onClick={() => openView(reciter)}
                            title="View reciter"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(reciter)}
                            title="Edit reciter"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(reciter)}
                            title="Delete reciter"
                          >
                            <Trash2 size={15} />
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
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}{" "}
                <small>({totalReciters} reciters)</small>
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {viewModalOpen && activeReciter && (
        <ReciterViewModal
          reciter={activeReciter}
          onClose={() => setViewModalOpen(false)}
          onEdit={(r) => openEdit(r)}
        />
      )}

      {editModalOpen && (
        <ReciterFormModal
          reciter={activeReciter}
          onSave={handleEditSave}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
}

export default ReciterPageTable;
