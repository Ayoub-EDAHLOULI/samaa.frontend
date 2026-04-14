"use client";

import "./LanguagePageTable.scss";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import Swal from "sweetalert2";
import { Language } from "@/types/languages.types";
import { languageService } from "@/services/language.service";
import LanguageFormModal from "../LanguageFormModal/LanguageFormModal";

function LanguagePageTable() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await languageService.getAll();
      setLanguages(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const openCreate = () => {
    setEditingLanguage(null);
    setModalOpen(true);
  };

  const openEdit = (lang: Language) => {
    setEditingLanguage(lang);
    setModalOpen(true);
  };

  const handleModalSave = (saved: Language) => {
    setModalOpen(false);
    if (editingLanguage) {
      // If saved as default, unset all others locally
      setLanguages((prev) =>
        prev.map((l) => {
          if (l.code === saved.code) return saved;
          if (saved.isDefault) return { ...l, isDefault: false };
          return l;
        }),
      );
    } else {
      // New language — if default, unset others and prepend
      setLanguages((prev) => {
        const updated = saved.isDefault
          ? prev.map((l) => ({ ...l, isDefault: false }))
          : [...prev];
        return [saved, ...updated];
      });
    }
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: editingLanguage ? "Language updated." : "Language added.",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleDelete = async (lang: Language) => {
    if (lang.isDefault) {
      Swal.fire(
        "Cannot Delete",
        "The default language cannot be deleted.",
        "warning",
      );
      return;
    }

    const result = await Swal.fire({
      title: `Delete "${lang.name}" (${lang.code.toUpperCase()})?`,
      text: "This will also remove all reciter translations in this language.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await languageService.delete(lang.code);
      setLanguages((prev) => prev.filter((l) => l.code !== lang.code));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Language deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete language.";
      Swal.fire("Cannot Delete", msg, "error");
    }
  };

  // Sort: default first, then alphabetically by code
  const sorted = [...languages].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.code.localeCompare(b.code);
  });

  return (
    <>
      <div className="admin-table-container">
        {/* Header */}
        <div className="admin-table-header">
          <div className="admin-table-title">
            <h2>Languages</h2>
            <p>
              Manage the supported languages for reciter content and the app UI.
            </p>
          </div>
          <button className="btn-add" onClick={openCreate}>
            <Plus size={16} />
            Add Language
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="loading-text">Loading languages…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="loading-text">
                    No languages found. Add one to get started.
                  </td>
                </tr>
              ) : (
                sorted.map((lang) => (
                  <tr key={lang.code}>
                    <td className="code-cell">{lang.code}</td>

                    <td>
                      <div className="badges-cell">
                        <span className="name-cell">{lang.name}</span>
                        {lang.isDefault && (
                          <span className="badge badge-default">
                            <Star size={10} />
                            Default
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${lang.isActive ? "badge-active" : "badge-inactive"}`}
                      >
                        {lang.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="date-cell">
                      {new Date(lang.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => openEdit(lang)}
                          title="Edit language"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(lang)}
                          title={
                            lang.isDefault
                              ? "Cannot delete default language"
                              : "Delete language"
                          }
                          disabled={lang.isDefault}
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
        )}
      </div>

      {modalOpen && (
        <LanguageFormModal
          language={editingLanguage}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default LanguagePageTable;
