"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Search, ChevronDown, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, Download, Image as ImageIcon, X, Check, AlertTriangle, Filter, RefreshCw, Settings2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  title: string;
  image: string;
  parent: string;
  commission: string;
  status: "active" | "inactive";
  requiresApproval: boolean;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  { id: "CAT-001", title: "Fruits & Vegetables", image: "🍎", parent: "—", commission: "5%", status: "active", requiresApproval: false, createdAt: "12 Jan 2026" },
  { id: "CAT-002", title: "Dairy & Eggs", image: "🥛", parent: "—", commission: "4%", status: "active", requiresApproval: false, createdAt: "12 Jan 2026" },
  { id: "CAT-003", title: "Beverages", image: "🥤", parent: "—", commission: "6%", status: "active", requiresApproval: true, createdAt: "15 Jan 2026" },
  { id: "CAT-004", title: "Snacks & Chips", image: "🍿", parent: "—", commission: "7%", status: "active", requiresApproval: false, createdAt: "15 Jan 2026" },
  { id: "CAT-005", title: "Bakery & Bread", image: "🍞", parent: "—", commission: "5%", status: "active", requiresApproval: true, createdAt: "18 Jan 2026" },
  { id: "CAT-006", title: "Meat & Seafood", image: "🥩", parent: "—", commission: "8%", status: "inactive", requiresApproval: true, createdAt: "20 Jan 2026" },
  { id: "CAT-007", title: "Frozen Foods", image: "🧊", parent: "—", commission: "5%", status: "active", requiresApproval: false, createdAt: "22 Jan 2026" },
  { id: "CAT-008", title: "Personal Care", image: "🧴", parent: "—", commission: "10%", status: "active", requiresApproval: false, createdAt: "25 Jan 2026" },
  { id: "CAT-009", title: "Household Items", image: "🧹", parent: "—", commission: "9%", status: "active", requiresApproval: false, createdAt: "28 Jan 2026" },
  { id: "CAT-010", title: "Baby Products", image: "🍼", parent: "—", commission: "12%", status: "active", requiresApproval: true, createdAt: "01 Feb 2026" },
  { id: "CAT-011", title: "Pet Supplies", image: "🐾", parent: "—", commission: "10%", status: "inactive", requiresApproval: false, createdAt: "05 Feb 2026" },
  { id: "CAT-012", title: "Organic & Health", image: "🥗", parent: "—", commission: "8%", status: "active", requiresApproval: true, createdAt: "10 Feb 2026" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Category; dir: "asc" | "desc" } | null>(null);

  // Column Visibility State
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    image: true,
    parent: true,
    commission: true,
    status: true,
    requiresApproval: true,
    createdAt: true,
    action: true,
  });
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target as Node)) {
        setShowColumnsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formParent, setFormParent] = useState("—");
  const [formCommission, setFormCommission] = useState("5%");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formRequiresApproval, setFormRequiresApproval] = useState(false);
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaKeywords, setFormMetaKeywords] = useState("");
  const [formSchemaMarkup, setFormSchemaMarkup] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");

  // ─── Computed ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = categories;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter(c => c.status === statusFilter);
    }
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [categories, searchQuery, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentRows = filtered.slice(startIdx, startIdx + itemsPerPage);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleSort = (key: keyof Category) => {
    setSortConfig(prev => prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const toggleStatus = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
    toast.success("Status updated!");
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
    toast.success("Category deleted!");
  };

  const resetForm = () => { 
    setFormTitle(""); 
    setFormParent("—"); 
    setFormCommission("5%"); 
    setFormStatus("active"); 
    setFormRequiresApproval(false); 
    setFormSlug("");
    setFormSubtitle("");
    setFormMetaTitle("");
    setFormMetaKeywords("");
    setFormSchemaMarkup("");
    setFormMetaDescription("");
  };

  const openAddModal = () => { resetForm(); setEditingCategory(null); setShowAddModal(true); };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormTitle(cat.title); 
    setFormParent(cat.parent); 
    setFormCommission(cat.commission); 
    setFormStatus(cat.status); 
    setFormRequiresApproval(cat.requiresApproval);
    setFormSlug(cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    setFormSubtitle("");
    setFormMetaTitle("");
    setFormMetaKeywords("");
    setFormSchemaMarkup("");
    setFormMetaDescription("");
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) { toast.error("Please fill required fields"); return; }

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, title: formTitle, parent: formParent, commission: formCommission, status: formStatus, requiresApproval: formRequiresApproval } : c));
      toast.success("Category updated!");
    } else {
      const newCat: Category = { 
        id: `CAT-${String(categories.length + 1).padStart(3, "0")}`, 
        title: formTitle, 
        parent: formParent, 
        image: "📦", 
        commission: formCommission, 
        status: formStatus, 
        requiresApproval: formRequiresApproval, 
        createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) 
      };
      setCategories(prev => [...prev, newCat]);
      toast.success("Category created!");
    }
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d3136] font-sans -mt-6 -mx-6 p-4 md:p-8">

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Categories</h1>
          <div className="text-sm text-[#FF6900] flex items-center gap-2 mt-1">
            <Link href="/admin/dashboard" className="hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Categories</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={14} /> Sort
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#FF6900]/30 text-[#FF6900] rounded-md text-sm font-medium hover:bg-[#FF6900] hover:text-white transition-colors group">
            <RefreshCw size={14} className="group-hover:animate-spin-once" /> Refresh
          </button>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#FF6900] text-white rounded-md text-sm font-medium hover:bg-[#e55f00] transition-colors">
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-md">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900] w-64"
              />
            </div>
            {/* Columns Dropdown */}
            <div className="relative" ref={columnDropdownRef}>
              <button 
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings2 size={14} /> Columns <ChevronDown size={14} />
              </button>
              {showColumnsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 flex flex-col p-1 gap-1">
                  {[
                    { key: "title", label: "1: Title" },
                    { key: "image", label: "2: Image" },
                    { key: "parent", label: "3: Parent" },
                    { key: "commission", label: "4: Commission" },
                    { key: "status", label: "5: Status" },
                    { key: "requiresApproval", label: "6: Requires Approval" },
                    { key: "createdAt", label: "7: Created At" },
                    { key: "action", label: "8: Action" }
                  ].map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key as keyof typeof visibleColumns)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                        visibleColumns[col.key as keyof typeof visibleColumns]
                          ? "bg-[#FF6900]/10 text-[#FF6900] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {col.label}
                      {visibleColumns[col.key as keyof typeof visibleColumns] && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={14} /> Export
            </button>
            {/* Status filter */}
            <div className="relative ml-1">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Items per page */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Show
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="appearance-none bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900]">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-[12px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">ID {sortConfig?.key === "id" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                </th>
                {visibleColumns.title && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("title")}>
                    <div className="flex items-center gap-1">Title {sortConfig?.key === "title" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.image && <th className="px-4 py-3">Image</th>}
                {visibleColumns.parent && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("parent")}>
                    <div className="flex items-center gap-1">Parent {sortConfig?.key === "parent" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.commission && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("commission")}>
                    <div className="flex items-center gap-1">Commission {sortConfig?.key === "commission" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.status && <th className="px-4 py-3">Status</th>}
                {visibleColumns.requiresApproval && <th className="px-4 py-3">Requires Approval</th>}
                {visibleColumns.createdAt && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center gap-1">Created At {sortConfig?.key === "createdAt" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.action && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((cat, idx) => (
                <tr key={cat.id} className={cn("border-b border-gray-100 transition-colors hover:bg-[#FF6900]/[0.02]", idx % 2 === 0 && "bg-gray-50/30")}>
                  <td className="px-4 py-3 text-gray-500 font-mono text-[12px]">{cat.id}</td>
                  {visibleColumns.title && <td className="px-4 py-3 font-medium text-gray-800">{cat.title}</td>}
                  {visibleColumns.image && (
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-lg">
                        {cat.image}
                      </div>
                    </td>
                  )}
                  {visibleColumns.parent && <td className="px-4 py-3 text-gray-500">{cat.parent}</td>}
                  {visibleColumns.commission && <td className="px-4 py-3 text-gray-600 font-medium">{cat.commission}</td>}
                  
                  {visibleColumns.status && (
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(cat.id)} className="group flex items-center gap-1.5">
                        {cat.status === "active" ? (
                          <> <ToggleRight size={20} className="text-emerald-500" /> <span className="text-[11px] font-semibold text-emerald-600">Active</span> </>
                        ) : (
                          <> <ToggleLeft size={20} className="text-gray-400" /> <span className="text-[11px] font-semibold text-gray-400">Inactive</span> </>
                        )}
                      </button>
                    </td>
                  )}
                  {visibleColumns.requiresApproval && (
                    <td className="px-4 py-3">
                      {cat.requiresApproval ? (
                        <span className="text-[11px] font-semibold bg-[#FF6900]/10 text-[#FF6900] px-2 py-1 rounded">Yes</span>
                      ) : (
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-400 px-2 py-1 rounded">No</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.createdAt && <td className="px-4 py-3 text-gray-500 text-[12px]">{cat.createdAt}</td>}
                  {visibleColumns.action && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(cat)} className="p-1.5 rounded-md hover:bg-[#FF6900]/10 text-gray-400 hover:text-[#FF6900] transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(cat.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200">
          <span>{filtered.length > 0 ? `${startIdx + 1}-${Math.min(startIdx + itemsPerPage, filtered.length)} of ${filtered.length}` : "0 results"}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn("px-3 py-1.5 border rounded-md", currentPage === 1 ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={cn("px-3 py-1.5 border rounded-md font-medium", currentPage === p ? "border-[#FF6900] bg-[#FF6900]/10 text-[#FF6900]" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className={cn("px-3 py-1.5 border rounded-md", currentPage === totalPages || totalPages === 0 ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>→</button>
          </div>
        </div>
      </div>

      {/* ─── Add / Edit Modal (Centered) ──────────────────────────── */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <div className="fixed top-[2%] left-1/2 -translate-x-1/2 w-full max-w-4xl max-h-[96vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-[#1f2937]">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-red-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">


              <div className="space-y-6">
                {/* Parent */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Parent Category</label>
                  <div className="relative">
                    <select value={formParent} onChange={(e) => setFormParent(e.target.value)} className="w-full appearance-none px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]">
                      <option value="—">None (Root Category)</option>
                      {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Category Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Slug <span className="text-red-500">*</span></label>
                  <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Category Subtitle <span className="text-red-500">*</span></label>
                  <input type="text" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1">Image <span className="text-red-500">*</span></label>
                  <p className="text-[12px] text-[#6b778c] mb-2">Please choose square image of larger than 350px*350px & smaller than 550px*550px.</p>
                  <div className="border-2 border-dashed border-[#d1d5db] rounded-lg p-6 flex flex-col items-center justify-center bg-[#f8f9fa] hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload size={28} className="text-[#6c757d] mb-2" />
                    <p className="text-sm font-medium text-[#6c757d]">Drop Files here or click to upload</p>
                  </div>
                  {/* Image Preview Mock */}
                  <div className="mt-4">
                     <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#c59c99] bg-[#d3a8a3] flex items-center justify-center text-4xl shadow-sm">
                        {editingCategory?.image || "📦"}
                     </div>
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Meta Title</label>
                  <input type="text" value={formMetaTitle} onChange={(e) => setFormMetaTitle(e.target.value)} placeholder="Enter Meta Title" className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Meta Keywords</label>
                  <input type="text" value={formMetaKeywords} onChange={(e) => setFormMetaKeywords(e.target.value)} placeholder="Enter Meta Keywords" className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Schema Markup */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="block text-[13px] font-medium text-[#5c6873]">Schema Markup</label>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-[#5c6873] text-[#5c6873] text-[10px] cursor-help" title="JSON-LD schema">i</span>
                  </div>
                  <input type="text" value={formSchemaMarkup} onChange={(e) => setFormSchemaMarkup(e.target.value)} placeholder="Enter Schema Markup" className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Meta Description</label>
                  <textarea rows={4} value={formMetaDescription} onChange={(e) => setFormMetaDescription(e.target.value)} placeholder="Enter Meta Description" className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900] resize-y" />
                </div>

                {/* Status Toggle Buttons */}
                <div>
                  <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Status</label>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
                    <button type="button" onClick={() => setFormStatus("inactive")} className={cn("px-4 py-2 text-sm flex items-center gap-2 transition-colors", formStatus === "inactive" ? "bg-white text-gray-700" : "bg-white text-gray-500 hover:bg-gray-50")}>
                      <span className={cn("w-3.5 h-3.5 rounded-full border border-gray-400", formStatus === "inactive" ? "border-2 border-gray-700" : "")} /> Deactivate
                    </button>
                    <div className="w-px h-full bg-gray-300" />
                    <button type="button" onClick={() => setFormStatus("active")} className={cn("px-4 py-2 text-sm flex items-center gap-2 transition-colors", formStatus === "active" ? "bg-[#10b981] text-white" : "bg-white text-gray-500 hover:bg-gray-50")}>
                      <span className={cn("w-3.5 h-3.5 rounded-full border border-current", formStatus === "active" ? "bg-white border-none shadow-[inset_0_0_0_2px_#10b981]" : "border-gray-400")} /> Activate
                    </button>
                  </div>
                </div>
              </div>
            </form>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-[#f8f9fa] rounded-b-lg">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 bg-[#FF6900] text-white rounded text-sm font-medium hover:bg-[#e55f00] transition-colors">Save</button>
            </div>
          </div>
        </>
      )}

      {/* ─── Delete Confirm Modal ────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <>
          <div onClick={() => setShowDeleteConfirm(null)} className="fixed inset-0 bg-black/30 z-50 backdrop-blur-[2px]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle size={20} className="text-red-500" /></div>
              <div>
                <h3 className="font-semibold text-gray-800">Delete Category</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => deleteCategory(showDeleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
