"use client";

import "./BlogCategoryPageTable.scss";
import { useEffect, useState, useCallback } from "react";
import { blogCategoryService } from "@/services/blogcategory.service";
import {
  BlogCategory,
  PaginatedBlogCategoriesResponse,
} from "@/types/blog-category";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import BlogCategoryFormModal from "../BlogCategoryFormModal/BlogCategoryFormModal";

function BlogCategoryPageTable() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(
    null,
  );

  const fetchCategories = useCallback(
    async (pageNumber: number, search?: string) => {
      try {
        setLoading(true);
        const result: PaginatedBlogCategoriesResponse =
          await blogCategoryService.getPaginated(
            pageNumber,
            pageSize,
            search,
            "en",
          );
        setCategories(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalItems(result.meta.totalItems);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchCategories(page, searchTerm || undefined);
  }, [page, fetchCategories, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCategories(1, searchTerm || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchCategories]);

  const openCreate = () => {
    setActiveCategory(null);
    setFormModalOpen(true);
  };

  const openEdit = (category: BlogCategory) => {
    setActiveCategory(category);
    setFormModalOpen(true);
  };

  const handleFormSave = () => {
    const wasEdit = activeCategory !== null;
    setFormModalOpen(false);
    setActiveCategory(null);
    fetchCategories(page, searchTerm || undefined);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: wasEdit ? "Category updated." : "Category created.",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleDelete = async (category: BlogCategory) => {
    if (category.postsCount && category.postsCount > 0) {
      Swal.fire(
        "Cannot Delete",
        `This category has ${category.postsCount} post(s) attached. Reassign or delete the posts first.`,
        "error",
      );
      return;
    }

    const result = await Swal.fire({
      title: `Delete "${category.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await blogCategoryService.delete(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      setTotalItems((n) => n - 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete category.";
      Swal.fire("Cannot Delete", msg, "error");
    }
  };

  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max) + "…" : str;

  return (
    <>
      <div className="admin-table-container">
        {/* Header */}
        <div className="admin-table-header">
          <div className="admin-table-title">
            <h2>Blog Categories</h2>
            <p className="admin-table-subtitle">
              Manage blog category slugs, translations, and active state.
            </p>
          </div>
          <div className="admin-table-actions">
            <div className="admin-search-bar">
              <input
                type="text"
                placeholder="Search by title or handle…"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" />
            </div>
            <button className="btn-add" onClick={openCreate}>
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="loading-text">Loading categories…</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Handle</th>
                  <th>Description</th>
                  <th>Posts</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="loading-text">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.title}</td>
                      <td className="handle-cell">/blog/{cat.handle}</td>
                      <td>{truncate(cat.description || "", 60)}</td>
                      <td>
                        <span className="count-badge">
                          {cat.postsCount ?? 0}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${cat.isActive ? "active" : ""}`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="actions">
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(cat)}
                            title="Edit category"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(cat)}
                            title="Delete category"
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
                <small>({totalItems} categories)</small>
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

      {formModalOpen && (
        <BlogCategoryFormModal
          category={activeCategory}
          onSave={handleFormSave}
          onClose={() => {
            setFormModalOpen(false);
            setActiveCategory(null);
          }}
        />
      )}
    </>
  );
}

export default BlogCategoryPageTable;
