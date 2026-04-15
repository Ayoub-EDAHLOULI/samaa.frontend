"use client";

import "./BlogPostPageTable.scss";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { blogPostService } from "@/services/blogpost.service";
import { BlogPost, PaginatedBlogPostsResponse } from "@/types/blog-post";
import { Search, Plus, Pencil, Trash2, Eye, FileText } from "lucide-react";
import Swal from "sweetalert2";
import BlogPostFormModal from "../BlogPostFormModal/BlogPostFormModal";
import BlogPostViewModal from "../BlogPostViewModal/BlogPostViewModal";
import fullImageUrl from "@/utils/fullImageUrl";

function BlogPostPageTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(
    async (pageNumber: number, search?: string) => {
      try {
        setLoading(true);
        const result: PaginatedBlogPostsResponse =
          await blogPostService.getPaginated(pageNumber, pageSize, search);
        setPosts(result.data);
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
    fetchPosts(page, searchTerm || undefined);
  }, [page, fetchPosts, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts(1, searchTerm || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchPosts]);

  const openView = (post: BlogPost) => {
    setActivePost(post);
    setViewModalOpen(true);
  };

  const openCreate = () => {
    setActivePost(null);
    setFormModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setActivePost(post);
    setViewModalOpen(false);
    setFormModalOpen(true);
  };

  const handleFormSave = () => {
    const wasEdit = activePost !== null;
    setFormModalOpen(false);
    setActivePost(null);
    fetchPosts(page, searchTerm || undefined);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: wasEdit ? "Post updated." : "Post created.",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleDelete = async (post: BlogPost) => {
    const result = await Swal.fire({
      title: `Delete "${post.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await blogPostService.delete(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setTotalItems((n) => n - 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Post deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete post.";
      Swal.fire("Cannot Delete", msg, "error");
    }
  };

  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max) + "…" : str;

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString() : "—";

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-header">
          <div className="admin-table-title">
            <h2>Blog Posts</h2>
            <p className="admin-table-subtitle">
              Manage articles, translations, and publication status.
            </p>
          </div>
          <div className="admin-table-actions">
            <div className="admin-search-bar">
              <input
                type="text"
                placeholder="Search by title, handle, author…"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" />
            </div>
            <button className="btn-add" onClick={openCreate}>
              <Plus size={16} />
              New Post
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading posts…</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="loading-text">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="clickable-row"
                      onClick={() => openView(post)}
                    >
                      <td>
                        <div className="post-info-cell">
                          <div className="post-thumb">
                            {post.imageUrl ? (
                              <Image
                                src={fullImageUrl(post.imageUrl)}
                                alt={post.title}
                                width={44}
                                height={44}
                                className="thumb-img"
                                unoptimized
                              />
                            ) : (
                              <FileText size={18} className="thumb-icon" />
                            )}
                          </div>
                          <div className="post-details">
                            <span className="post-title">
                              {truncate(post.title, 55)}
                            </span>
                            <span className="post-handle">{post.handle}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {post.category?.title ?? "—"}
                        </span>
                      </td>
                      <td className="author-cell">{post.author}</td>
                      <td>
                        <span
                          className={`status-badge ${post.isPublished ? "published" : "draft"}`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="stat-cell">
                        {post.viewCount.toLocaleString()}
                      </td>
                      <td className="date-cell">
                        {formatDate(post.publishedAt)}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="actions">
                          <button
                            className="btn-view"
                            onClick={() => openView(post)}
                            title="View post"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(post)}
                            title="Edit post"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(post)}
                            title="Delete post"
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

            <div className="pagination-controls">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages} <small>({totalItems} posts)</small>
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

      {viewModalOpen && activePost && (
        <BlogPostViewModal
          post={activePost}
          onClose={() => {
            setViewModalOpen(false);
            setActivePost(null);
          }}
          onEdit={(p) => openEdit(p)}
        />
      )}

      {formModalOpen && (
        <BlogPostFormModal
          post={activePost}
          onSave={handleFormSave}
          onClose={() => {
            setFormModalOpen(false);
            setActivePost(null);
          }}
        />
      )}
    </>
  );
}

export default BlogPostPageTable;
