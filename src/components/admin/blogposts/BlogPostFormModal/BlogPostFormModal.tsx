"use client";

import "./BlogPostFormModal.scss";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  blogPostFormSchema,
  BlogPostFormValues,
} from "@/validations/blog-post.schema";
import { BlogPost, AdminBlogPost } from "@/types/blog-post";
import { BlogCategory } from "@/types/blog-category";
import { Language } from "@/types/languages.types";
import { blogPostService } from "@/services/blogpost.service";
import { blogCategoryService } from "@/services/blogcategory.service";
import { languageService } from "@/services/language.service";
import { X, Upload, Loader2 } from "lucide-react";
import fullImageUrl from "@/utils/fullImageUrl";
import RichTextEditor from "@/components/ui/RichTextEditor/RichTextEditor";

// ---------------------------------------------------------------------------
// Per-language placeholder text
// ---------------------------------------------------------------------------
const LANG_PLACEHOLDERS: Record<
  string,
  { title: string; content: string; excerpt: string; tags: string }
> = {
  en: {
    title: "e.g. The Beauty of Quran Recitation",
    content: "Write the full article content in English…",
    excerpt: "Short summary shown in post previews…",
    tags: "e.g. quran, recitation, tajweed",
  },
  fr: {
    title: "ex. La beauté de la récitation du Coran",
    content: "Rédigez le contenu complet de l'article en français…",
    excerpt: "Résumé court affiché dans les aperçus…",
    tags: "ex. coran, récitation, tajweed",
  },
  es: {
    title: "ej. La belleza de la recitación del Corán",
    content: "Escribe el contenido completo del artículo en español…",
    excerpt: "Resumen corto mostrado en las vistas previas…",
    tags: "ej. corán, recitación, tajweed",
  },
  ary: {
    title: "مثال: جمال تلاوة القرآن الكريم",
    content: "اكتب محتوى المقال الكامل بالعربية…",
    excerpt: "ملخص قصير يظهر في معاينات المقال…",
    tags: "مثال: قرآن، تلاوة، تجويد",
  },
};

const DEFAULT_PLACEHOLDERS = {
  title: "Post title…",
  content: "Full article content…",
  excerpt: "Short excerpt…",
  tags: "Tags (comma-separated)…",
};

function ph(lang: string) {
  return LANG_PLACEHOLDERS[lang] ?? DEFAULT_PLACEHOLDERS;
}

// ---------------------------------------------------------------------------

interface Props {
  post: BlogPost | null; // null = create mode
  onSave: () => void;
  onClose: () => void;
}

export default function BlogPostFormModal({ post, onSave, onClose }: Props) {
  const isEdit = post !== null;

  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("en");
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.imageUrl ? fullImageUrl(post.imageUrl) : null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      handle: "",
      categoryId: undefined,
      isPublished: false,
      publishedAt: "",
      readTimeMinutes: null,
      image: undefined,
      translations: {},
    },
  });

  // Auto-generate handle from English title in create mode
  const enTitle = useWatch({
    control,
    name: "translations.en.title" as never,
  }) as string | undefined;

  useEffect(() => {
    if (!isEdit && enTitle) {
      const slug = (enTitle as string)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("handle", slug, { shouldValidate: false });
    }
  }, [enTitle, isEdit, setValue]);

  useEffect(() => {
    const load = async () => {
      try {
        const [langs, cats, adminPost]: [
          Language[],
          { data: BlogCategory[] } | BlogCategory[],
          AdminBlogPost | null,
        ] = await Promise.all([
          languageService.getAll(),
          blogCategoryService.getAll("en").then((d) => d),
          isEdit ? blogPostService.getById(post!.id) : Promise.resolve(null),
        ]);

        const langList = langs;
        const catList = Array.isArray(cats) ? cats : ((cats as any).data ?? []);

        setLanguages(langList);
        setCategories(catList);
        if (adminPost?.imageUrl)
          setImagePreview(fullImageUrl(adminPost.imageUrl));

        const defaultLang =
          langList.find((l) => l.isDefault)?.code ?? langList[0]?.code ?? "en";
        setActiveTab(defaultLang);

        const translations = Object.fromEntries(
          langList.map((lang) => {
            const existing = adminPost?.translations.find(
              (t) => t.languageCode === lang.code,
            );
            return [
              lang.code,
              {
                title: existing?.title ?? "",
                content: existing?.content ?? "",
                excerpt: existing?.excerpt ?? "",
                metaTitle: existing?.metaTitle ?? "",
                metaDescription: existing?.metaDescription ?? "",
                tags: existing?.tags ?? "",
              },
            ];
          }),
        );

        // Format publishedAt for <input type="datetime-local">
        const publishedAtValue = adminPost?.publishedAt
          ? new Date(adminPost.publishedAt).toISOString().slice(0, 16)
          : "";

        reset({
          handle: adminPost?.handle ?? post?.handle ?? "",
          categoryId: adminPost?.categoryId ?? post?.category?.id ?? undefined,
          isPublished: adminPost?.isPublished ?? post?.isPublished ?? false,
          publishedAt: publishedAtValue,
          readTimeMinutes: adminPost?.readTimeMinutes ?? null,
          image: undefined,
          translations,
        });
      } finally {
        setLoadingData(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      setSubmitError(null);
      if (isEdit) {
        await blogPostService.update(post!.id, values);
      } else {
        await blogPostService.create(values);
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
      <div className="modal-card wide">
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit Post" : "New Blog Post"}</h2>
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
              {/* Image upload */}
              <div
                className="image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="image-preview"
                    unoptimized
                  />
                ) : (
                  <div className="image-placeholder">
                    <Upload size={22} />
                    <span>Click to upload cover image</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* ── Core fields ── */}
              <p className="section-label">Core</p>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    Handle <span className="required">*</span>
                  </label>
                  <input
                    {...register("handle")}
                    placeholder="e.g. beauty-of-quran-recitation"
                    className={errors.handle ? "input-error" : ""}
                  />
                  {errors.handle && (
                    <p className="field-error">{errors.handle.message}</p>
                  )}
                  <p className="field-hint">
                    Auto-generated from EN title. Lowercase, hyphens only.
                  </p>
                </div>

                <div className="form-group">
                  <label>
                    Category <span className="required">*</span>
                  </label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className={errors.categoryId ? "input-error" : ""}
                      >
                        <option value="">— Select category —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="field-error">
                      {errors.categoryId.message as string}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Read Time (minutes)</label>
                  <Controller
                    name="readTimeMinutes"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        min={1}
                        max={120}
                        placeholder="e.g. 5"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      />
                    )}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" {...register("isPublished")} />
                    <span>Published</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Published At</label>
                  <input type="datetime-local" {...register("publishedAt")} />
                  <p className="field-hint">
                    Leave blank to auto-set when publishing.
                  </p>
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
                          <label>Content</label>
                          <Controller
                            name={`translations.${lang.code}.content` as never}
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                value={(field.value as string) || ""}
                                onChange={field.onChange}
                                placeholder={ph(lang.code).content}
                                className={lang.code === "ary" ? "rtl" : ""}
                              />
                            )}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Excerpt</label>
                          <textarea
                            {...register(
                              `translations.${lang.code}.excerpt` as never,
                            )}
                            rows={3}
                            placeholder={ph(lang.code).excerpt}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group">
                          <label>Meta Title</label>
                          <input
                            {...register(
                              `translations.${lang.code}.metaTitle` as never,
                            )}
                            placeholder="SEO title…"
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group">
                          <label>Tags</label>
                          <input
                            {...register(
                              `translations.${lang.code}.tags` as never,
                            )}
                            placeholder={ph(lang.code).tags}
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
                            placeholder="SEO meta description…"
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(errors.translations as { message?: string })?.message && (
                <p className="translations-error">
                  {(errors.translations as { message?: string }).message}
                </p>
              )}

              {submitError && (
                <p className="translations-error">{submitError}</p>
              )}
            </div>

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
                  "Publish Post"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
