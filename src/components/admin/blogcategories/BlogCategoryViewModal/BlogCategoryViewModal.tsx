"use client";

import "./BlogCategoryViewModal.scss";
import { useEffect, useState } from "react";
import { X, Loader2, Pencil, Tag } from "lucide-react";
import { BlogCategory, AdminBlogCategory, BlogCategoryTranslation } from "@/types/blog-category";
import { Language } from "@/types/languages.types";
import { blogCategoryService } from "@/services/blogcategory.service";
import { languageService } from "@/services/language.service";

interface Props {
  category: BlogCategory;
  onClose: () => void;
  onEdit: (category: BlogCategory) => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default function BlogCategoryViewModal({ category, onClose, onEdit }: Props) {
  const [adminCategory, setAdminCategory] = useState<AdminBlogCategory | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, langs] = await Promise.all([
          blogCategoryService.getById(category.id),
          languageService.getAll(),
        ]);
        setAdminCategory(detail);
        setLanguages(langs);
        const defaultLang =
          langs.find((l) => l.isDefault)?.code ?? langs[0]?.code ?? "en";
        setActiveTab(defaultLang);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category.id]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const activeTrans: BlogCategoryTranslation | undefined =
    adminCategory?.translations.find((t) => t.languageCode === activeTab);

  const displayTitle =
    adminCategory?.translations.find((t) => t.languageCode === "en")?.title ??
    adminCategory?.translations[0]?.title ??
    category.title;

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="view-modal-card">
        {/* Header */}
        <div className="view-modal-header">
          <div className="view-header-info">
            <div className="view-header-title-row">
              <Tag size={15} className="view-header-icon" />
              <h2>{displayTitle}</h2>
            </div>
            <span className="view-header-handle">/blog/{category.handle}</span>
          </div>
          <div className="view-header-actions">
            <button
              className="btn-edit-header"
              onClick={() => onEdit(category)}
              title="Edit category"
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
            {/* Core info */}
            <div className="view-section">
              <p className="view-section-title">Core</p>
              <div className="info-grid">
                <InfoRow
                  label="Handle"
                  value={
                    <span className="mono">{adminCategory?.handle}</span>
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <span className={`status-pill ${adminCategory?.isActive ? "active" : "inactive"}`}>
                      {adminCategory?.isActive ? "Active" : "Inactive"}
                    </span>
                  }
                />
                <InfoRow
                  label="Posts"
                  value={
                    <span className="count-badge">
                      {adminCategory?._count?.posts ?? category.postsCount ?? 0}
                    </span>
                  }
                />
                <InfoRow
                  label="Created"
                  value={new Date(category.createdAt).toLocaleDateString()}
                />
                <InfoRow
                  label="Updated"
                  value={new Date(category.updatedAt).toLocaleDateString()}
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
                      const hasTrans = adminCategory?.translations.some(
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
                            <span className="tab-default-dot" title="Default language" />
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

                        {/* Description */}
                        {activeTrans.description && (
                          <div className="trans-field full">
                            <span className="trans-label">Description</span>
                            <p
                              className="trans-text"
                              dir={activeTab === "ary" ? "rtl" : "ltr"}
                            >
                              {activeTrans.description}
                            </p>
                          </div>
                        )}

                        {/* SEO fields */}
                        {(activeTrans.metaTitle || activeTrans.metaDescription) && (
                          <div className="seo-block">
                            <p className="seo-block-label">SEO</p>
                            {activeTrans.metaTitle && (
                              <div className="trans-field full">
                                <span className="trans-label">Meta Title</span>
                                <span
                                  className="trans-value"
                                  dir={activeTab === "ary" ? "rtl" : "ltr"}
                                >
                                  {activeTrans.metaTitle}
                                </span>
                              </div>
                            )}
                            {activeTrans.metaDescription && (
                              <div className="trans-field full">
                                <span className="trans-label">Meta Description</span>
                                <p
                                  className="trans-text"
                                  dir={activeTab === "ary" ? "rtl" : "ltr"}
                                >
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
