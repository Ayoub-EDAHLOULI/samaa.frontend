"use client";

import "./SurahPageTable.scss";
import React, { useEffect, useState, useCallback } from "react";
import { surahService } from "@/services/surah.service";
import { Surah, UpdateSurahDto } from "@/types/surahs.types";
import { Search, Pencil, Check, X } from "lucide-react";
import Swal from "sweetalert2";

// Inline edit state for one row
interface EditState {
  arabicName: string;
  englishName: string;
  ayahCount: string; // string for input binding, parse on save
}

function SurahPageTable() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // id of the row currently being edited (null = no row in edit mode)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({
    arabicName: "",
    englishName: "",
    ayahCount: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchSurahs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await surahService.getAll();
      setSurahs(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.arabicName.includes(searchTerm) ||
      String(s.id).includes(searchTerm),
  );

  const startEdit = (surah: Surah) => {
    setEditingId(surah.id);
    setEditState({
      arabicName: surah.arabicName,
      englishName: surah.englishName,
      ayahCount: String(surah.ayahCount),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (surah: Surah) => {
    const ayahCount = parseInt(editState.ayahCount);
    if (isNaN(ayahCount) || ayahCount < 1 || ayahCount > 286) {
      Swal.fire(
        "Validation Error",
        "Ayah count must be between 1 and 286.",
        "warning",
      );
      return;
    }

    const dto: UpdateSurahDto = {};
    if (editState.arabicName.trim() !== surah.arabicName)
      dto.arabicName = editState.arabicName.trim();
    if (editState.englishName.trim() !== surah.englishName)
      dto.englishName = editState.englishName.trim();
    if (ayahCount !== surah.ayahCount) dto.ayahCount = ayahCount;

    if (Object.keys(dto).length === 0) {
      cancelEdit();
      return;
    }

    try {
      setSaving(true);
      const updated = await surahService.update(surah.id, dto);
      setSurahs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingId(null);
    } catch (err) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Failed to update surah.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-table-container">
      {/* Header */}
      <div className="admin-table-header">
        <div className="admin-table-title">
          <h2>Surahs</h2>
          <p className="admin-table-subtitle">
            All 114 Surahs of the Quran. Click the edit icon to correct names or
            ayah counts.
          </p>
        </div>
        <div className="admin-table-actions">
          <div className="admin-search-bar">
            <input
              type="text"
              placeholder="Search by name or number…"
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
        <p className="loading-text">Loading surahs…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Arabic Name</th>
              <th>English Name</th>
              <th>Ayahs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurahs.length === 0 ? (
              <tr>
                <td colSpan={5} className="loading-text">
                  No surahs found.
                </td>
              </tr>
            ) : (
              filteredSurahs.map((surah) =>
                editingId === surah.id ? (
                  /* ── Edit row ── */
                  <tr key={surah.id} className="editing-row">
                    <td className="surah-number">{surah.id}</td>
                    <td>
                      <input
                        className="inline-input rtl"
                        value={editState.arabicName}
                        onChange={(e) =>
                          setEditState((s) => ({
                            ...s,
                            arabicName: e.target.value,
                          }))
                        }
                        dir="rtl"
                      />
                    </td>
                    <td>
                      <input
                        className="inline-input"
                        value={editState.englishName}
                        onChange={(e) =>
                          setEditState((s) => ({
                            ...s,
                            englishName: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="inline-input ayah-input"
                        type="number"
                        min={1}
                        max={286}
                        value={editState.ayahCount}
                        onChange={(e) =>
                          setEditState((s) => ({
                            ...s,
                            ayahCount: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-save"
                          onClick={() => handleSave(surah)}
                          disabled={saving}
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={cancelEdit}
                          disabled={saving}
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ── Read row ── */
                  <tr key={surah.id}>
                    <td className="surah-number">{surah.id}</td>
                    <td className="arabic-cell">{surah.arabicName}</td>
                    <td>{surah.englishName}</td>
                    <td className="ayah-count">{surah.ayahCount}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => startEdit(surah)}
                          title="Edit surah"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      )}

      {/* Footer count */}
      {!loading && (
        <div className="table-footer">
          <span>
            {filteredSurahs.length} of {surahs.length} surahs
          </span>
        </div>
      )}
    </div>
  );
}

export default SurahPageTable;
