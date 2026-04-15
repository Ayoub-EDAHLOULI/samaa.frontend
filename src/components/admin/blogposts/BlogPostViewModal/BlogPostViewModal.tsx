"use client";

import "./BlogPostViewModal.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  Pencil,
  FileText,
  Eye as EyeIcon,
  Clock,
  Calendar,
} from "lucide-react";
import {
  BlogPost,
  AdminBlogPost,
  BlogPostTranslation,
} from "@/types/blog-post";
import { Language } from "@/types/languages.types";
import { blogPostService } from "@/services/blogpost.service";
import { languageService } from "@/services/language.service";
import fullImageUrl from "@/utils/fullImageUrl";

interface Props {
  post: BlogPost;
  onClose: () => void;
  onEdit: (post: BlogPost) => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default function BlogPostViewModal({ post, onClose, onEdit }: Props) {
  const [adminPost, setAdminPost] = useState<AdminBlogPost | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, langs] = await Promise.all([
          blogPostService.getById(post.id),
          languageService.getAll(),
        ]);
        setAdminPost(detail);
        setLanguages(langs);
        const defaultLang =
          langs.find((l) => l.isDefault)?.code ?? langs[0]?.code ?? "en";
        setActiveTab(defaultLang);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [post.id]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const activeTrans: BlogPostTranslation | undefined =
    adminPost?.translations.find((t) => t.languageCode === activeTab);

  const coverUrl = adminPost?.imageUrl
    ? fullImageUrl(adminPost.imageUrl)
    : null;

  const displayTitle =
    adminPost?.translations.find((t) => t.languageCode === "en")?.title ??
    adminPost?.translations[0]?.title ??
    post.title;

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="view-modal-card">
        {/* Header */}
        <div className="view-modal-header">
          <div className="view-header-info">
            <div className="view-header-title-row">
              <FileText size={14} className="view-header-icon" />
              <h2 title={displayTitle}>{displayTitle}</h2>
            </div>
            <span className="view-header-handle">{post.handle}</span>
          </div>
          <div className="view-header-actions">
            <button
              className="btn-edit-header"
              onClick={() => onEdit(post)}
              title="Edit post"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button className="modal-close" onClick={onClose} type="button">
              <X size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="view-loading">
            <Loader2 size={22} className="spin" />
            <span>Loading…</span>
          </div>
        ) : (
          <div className="view-modal-body">
            {/* Cover image */}
            {coverUrl ? (
              <div className="view-cover">
                <Image
                  src={coverUrl}
                  alt={displayTitle}
                  fill
                  className="cover-img"
                  unoptimized
                />
                <div className="cover-overlay" />
              </div>
            ) : (
              <div className="view-no-cover">
                <FileText size={28} className="no-cover-icon" />
              </div>
            )}

            {/* Core info */}
            <div className="view-section">
              <p className="view-section-title">Details</p>
              <div className="info-grid">
                <InfoRow
                  label="Category"
                  value={
                    <span className="category-pill">
                      {post.category?.title ?? "—"}
                    </span>
                  }
                />
                <InfoRow label="Author" value={post.author} />
                <InfoRow
                  label="Status"
                  value={
                    <span
                      className={`status-pill ${post.isPublished ? "published" : "draft"}`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  }
                />
                <InfoRow
                  label="Views"
                  value={
                    <span className="stat-value">
                      <EyeIcon size={13} />
                      {post.viewCount.toLocaleString()}
                    </span>
                  }
                />
                {adminPost?.readTimeMinutes && (
                  <InfoRow
                    label="Read time"
                    value={
                      <span className="stat-value">
                        <Clock size={13} />
                        {adminPost.readTimeMinutes} min
                      </span>
                    }
                  />
                )}
                {post.publishedAt && (
                  <InfoRow
                    label="Published"
                    value={
                      <span className="stat-value">
                        <Calendar size={13} />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    }
                  />
                )}
                <InfoRow
                  label="Created"
                  value={new Date(post.createdAt).toLocaleDateString()}
                />
              </div>
            </div>

            {/* Translations */}
            <div className="view-section">
              <p className="view-section-title">Translations</p>

              {languages.length === 0 ? (
                <p className="muted-hint">No languages configured.</p>
              ) : (
                <div className="lang-tabs-section">
                  <div className="lang-tabs" role="tablist">
                    {languages.map((lang) => {
                      const hasTrans = adminPost?.translations.some(
                        (t) => t.languageCode === lang.code && t.title,
                      );
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          role="tab"
                          aria-selected={activeTab === lang.code}
                          className={`lang-tab${activeTab === lang.code ? " active" : ""}${!hasTrans ? " empty" : ""}`}
                          onClick={() => setActiveTab(lang.code)}
                        >
                          {lang.code.toUpperCase()}
                          {lang.isDefault && (
                            <span
                              className="tab-default-dot"
                              title="Default language"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="lang-tab-content">
                    {!activeTrans?.title ? (
                      <p className="no-translation-hint">
                        No translation available for this language.
                      </p>
                    ) : (
                      <div className="translation-detail">
                        {/* Title */}
                        <div className="trans-field full">
                          <span className="trans-label">Title</span>
                          <span
                            className="trans-value"
                            dir={activeTab === "ary" ? "rtl" : "ltr"}
                          >
                            {activeTrans.title}
                          </span>
                        </div>

                        {/* Excerpt */}
                        {activeTrans.excerpt && (
                          <div className="trans-field full">
                            <span className="trans-label">Excerpt</span>
                            <p
                              className="trans-text excerpt"
                              dir={activeTab === "ary" ? "rtl" : "ltr"}
                            >
                              {activeTrans.excerpt}
                            </p>
                          </div>
                        )}

                        {/* Content */}
                        {activeTrans.content && (
                          <div className="trans-field full">
                            <span className="trans-label">Content</span>
                            <div className="content-preview">
                              <p
                                className="trans-text content"
                                dir={activeTab === "ary" ? "rtl" : "ltr"}
                              >
                                {activeTrans.content}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {activeTrans.tags && (
                          <div className="trans-field full">
                            <span className="trans-label">Tags</span>
                            <div className="tags-list">
                              {activeTrans.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                                .map((tag) => (
                                  <span key={tag} className="tag-pill">
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* SEO */}
                        {(activeTrans.metaTitle ||
                          activeTrans.metaDescription) && (
                          <div className="seo-block">
                            <p className="seo-block-label">SEO</p>
                            {activeTrans.metaTitle && (
                              <div className="trans-field full">
                                <span className="trans-label">Meta Title</span>
                                <span className="trans-value">
                                  {activeTrans.metaTitle}
                                </span>
                              </div>
                            )}
                            {activeTrans.metaDescription && (
                              <div className="trans-field full">
                                <span className="trans-label">
                                  Meta Description
                                </span>
                                <p className="trans-text">
                                  {activeTrans.metaDescription}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
