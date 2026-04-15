"use client";

import "./BlogCategoryFormModal.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  blogCategoryFormSchema,
  BlogCategoryFormValues,
} from "@/validations/blog-category.schema";
import { BlogCategory, AdminBlogCategory } from "@/types/blog-category";
import { Language } from "@/types/languages.types";
import { blogCategoryService } from "@/services/blogcategory.service";
import { languageService } from "@/services/language.service";
import { X, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Per-language placeholder text — add a new entry when adding a language
// ---------------------------------------------------------------------------
const LANG_PLACEHOLDERS: Record<
  string,
  {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
  }
> = {
  en: {
    title: "e.g. Islamic Jurisprudence",
    description: "Short description in English…",
    metaTitle: "SEO title in English…",
    metaDescription: "SEO meta description in English…",
  },
  fr: {
    title: "ex. Jurisprudence islamique",
    description: "Courte description en français…",
    metaTitle: "Titre SEO en français…",
    metaDescription: "Méta description SEO en français…",
  },
  es: {
    title: "ej. Jurisprudencia islámica",
    description: "Breve descripción en español…",
    metaTitle: "Título SEO en español…",
    metaDescription: "Meta descripción SEO en español…",
  },
  ary: {
    title: "مثال: الفقه الإسلامي",
    description: "وصف مختصر بالعربية…",
    metaTitle: "عنوان SEO بالعربية…",
    metaDescription: "وصف ميتا SEO بالعربية…",
  },
};

const DEFAULT_PLACEHOLDERS = {
  title: "Category title…",
  description: "Category description…",
  metaTitle: "SEO title…",
  metaDescription: "SEO meta description…",
};

function ph(lang: string) {
  return LANG_PLACEHOLDERS[lang] ?? DEFAULT_PLACEHOLDERS;
}

// ---------------------------------------------------------------------------

interface Props {
  category: BlogCategory | null; // null = create mode
  onSave: () => void;
  onClose: () => void;
}

export default function BlogCategoryFormModal({
  category,
  onSave,
  onClose,
}: Props) {
  const isEdit = category !== null;

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("en");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogCategoryFormValues>({
    resolver: zodResolver(blogCategoryFormSchema),
    defaultValues: {
      handle: "",
      isActive: true,
      translations: {},
    },
  });

  // Fetch languages + (in edit mode) the full admin detail with all translations
  useEffect(() => {
    const load = async () => {
      try {
        const [langs, adminCategory]: [Language[], AdminBlogCategory | null] =
          await Promise.all([
            languageService.getAll(),
            isEdit
              ? blogCategoryService.getById(category!.id)
              : Promise.resolve(null),
          ]);

        setLanguages(langs);

        const defaultLang =
          langs.find((l) => l.isDefault)?.code ?? langs[0]?.code ?? "en";
        setActiveTab(defaultLang);

        // Build translation defaults from existing data or empty strings
        const translations = Object.fromEntries(
          langs.map((lang) => {
            const existing = adminCategory?.translations.find(
              (t) => t.languageCode === lang.code,
            );
            return [
              lang.code,
              {
                title: existing?.title ?? "",
                description: existing?.description ?? "",
                metaTitle: existing?.metaTitle ?? "",
                metaDescription: existing?.metaDescription ?? "",
              },
            ];
          }),
        );

        reset({
          handle: adminCategory?.handle ?? category?.handle ?? "",
          isActive: adminCategory?.isActive ?? category?.isActive ?? true,
          translations,
        });
      } finally {
        setLoadingData(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: BlogCategoryFormValues) => {
    try {
      setSubmitError(null);

      // Build translations array — only include languages that have a title
      const translationsArray = Object.entries(values.translations)
        .filter(([, t]) => t?.title?.trim())
        .map(([languageCode, t]) => ({
          languageCode,
          title: t.title!.trim(),
          description: t.description?.trim() || undefined,
          metaTitle: t.metaTitle?.trim() || undefined,
          metaDescription: t.metaDescription?.trim() || undefined,
        }));

      if (isEdit) {
        await blogCategoryService.update(category!.id, {
          handle: values.handle,
          isActive: values.isActive,
          translations: translationsArray,
        });
      } else {
        await blogCategoryService.create({
          handle: values.handle,
          isActive: values.isActive,
          translations: translationsArray,
        });
      }

      onSave();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tabErrors = (
    errors.translations as Record<string, Record<string, { message?: string }>>
  )?.[activeTab];

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit Category" : "Add Category"}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {loadingData ? (
          <div className="modal-loading">
            <Loader2 size={22} className="spin" />
            <span>Loading…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="modal-body">
              {/* ── Core fields ── */}
              <p className="section-label">Core</p>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    Handle <span className="required">*</span>
                  </label>
                  <input
                    {...register("handle")}
                    placeholder="e.g. islamic-jurisprudence"
                    className={errors.handle ? "input-error" : ""}
                  />
                  {errors.handle && (
                    <p className="field-error">{errors.handle.message}</p>
                  )}
                  <p className="field-hint">
                    Lowercase letters, numbers, hyphens only. Used in URLs:
                    /blog/[handle]
                  </p>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" {...register("isActive")} />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              {/* ── Translations ── */}
              <p className="section-label">Translations</p>

              {languages.length === 0 ? (
                <p className="no-langs-hint">
                  No languages found. Add a language first.
                </p>
              ) : (
                <div className="lang-tabs-section">
                  {/* Tab strip */}
                  <div className="lang-tabs" role="tablist">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === lang.code}
                        className={`lang-tab${activeTab === lang.code ? " active" : ""}`}
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
                    ))}
                  </div>

                  {/* Tab content */}
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className="lang-tab-content"
                      hidden={activeTab !== lang.code}
                    >
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>Title</label>
                          <input
                            {...register(
                              `translations.${lang.code}.title` as never,
                            )}
                            placeholder={ph(lang.code).title}
                            className={
                              tabErrors?.title && activeTab === lang.code
                                ? "input-error"
                                : ""
                            }
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                          {tabErrors?.title && activeTab === lang.code && (
                            <p className="field-error">
                              {tabErrors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="form-group full-width">
                          <label>Description</label>
                          <textarea
                            {...register(
                              `translations.${lang.code}.description` as never,
                            )}
                            rows={3}
                            placeholder={ph(lang.code).description}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Meta Title</label>
                          <input
                            {...register(
                              `translations.${lang.code}.metaTitle` as never,
                            )}
                            placeholder={ph(lang.code).metaTitle}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Meta Description</label>
                          <textarea
                            {...register(
                              `translations.${lang.code}.metaDescription` as never,
                            )}
                            rows={2}
                            placeholder={ph(lang.code).metaDescription}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Global translations validation error */}
              {(errors.translations as { message?: string })?.message && (
                <p className="translations-error">
                  {(errors.translations as { message?: string }).message}
                </p>
              )}

              {submitError && (
                <p className="translations-error">{submitError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Category"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
