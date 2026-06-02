"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Search, ChevronDown, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, Download, Upload, Image as ImageIcon, X, Check, AlertTriangle, Filter, RefreshCw, Settings2, Package, Tag, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  store: string;
  price: number;
  discount: number;
  stock: number;
  status: "active" | "inactive";
  isApproved: boolean;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "PROD-001", name: "Organic Bananas (1kg)", brand: "FreshFarm", image: "🍌", category: "Fruits & Vegetables", store: "FreshMart Express", price: 49, discount: 5, stock: 150, status: "active", isApproved: true, createdAt: "12 Jan 2026" },
  { id: "PROD-002", name: "Farm Fresh Eggs (12)", brand: "HappyHens", image: "🥚", category: "Dairy & Eggs", store: "FreshMart Express", price: 89, discount: 0, stock: 45, status: "active", isApproved: true, createdAt: "12 Jan 2026" },
  { id: "PROD-003", name: "Greek Yogurt 500g", brand: "DairyBest", image: "🥛", category: "Dairy & Eggs", store: "FreshMart Express", price: 120, discount: 10, stock: 12, status: "inactive", isApproved: false, createdAt: "15 Jan 2026" },
  { id: "PROD-004", name: "Whole Wheat Bread", brand: "OvenBake", image: "🍞", category: "Bakery & Bread", store: "City Supermarket", price: 55, discount: 0, stock: 0, status: "active", isApproved: true, createdAt: "15 Jan 2026" },
  { id: "PROD-005", name: "Avocado Hass (2 pcs)", brand: "GreenLife", image: "🥑", category: "Fruits & Vegetables", store: "Organic Store", price: 140, discount: 15, stock: 8, status: "active", isApproved: true, createdAt: "18 Jan 2026" },
  { id: "PROD-006", name: "Premium Almonds 500g", brand: "NutriChoice", image: "🥜", category: "Snacks & Chips", store: "City Supermarket", price: 450, discount: 20, stock: 200, status: "inactive", isApproved: true, createdAt: "20 Jan 2026" },
  { id: "PROD-007", name: "Fresh Atlantic Salmon", brand: "SeaCatch", image: "🐟", category: "Meat & Seafood", store: "Gourmet Foods", price: 850, discount: 0, stock: 24, status: "active", isApproved: false, createdAt: "22 Jan 2026" },
  { id: "PROD-008", name: "Natural Honey 1kg", brand: "BeePure", image: "🍯", category: "Organic & Health", store: "Organic Store", price: 320, discount: 5, stock: 85, status: "active", isApproved: true, createdAt: "25 Jan 2026" },
  { id: "PROD-009", name: "Baby Diapers (Pack of 72)", brand: "SoftCare", image: "👶", category: "Baby Products", store: "Family Mart", price: 699, discount: 10, stock: 15, status: "active", isApproved: true, createdAt: "28 Jan 2026" },
  { id: "PROD-010", name: "Dog Food (Adult) 3kg", brand: "PetFeast", image: "🐕", category: "Pet Supplies", store: "Family Mart", price: 850, discount: 0, stock: 5, status: "active", isApproved: false, createdAt: "01 Feb 2026" },
];

const CATEGORIES = ["Fruits & Vegetables", "Dairy & Eggs", "Bakery & Bread", "Snacks & Chips", "Meat & Seafood", "Organic & Health", "Baby Products", "Pet Supplies"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; dir: "asc" | "desc" } | null>(null);

  // Checkbox State
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Current page rows
    const currentPageIds = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => p.id);
    if (e.target.checked) {
      setSelectedProducts(currentPageIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  // Column Visibility State
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    category: true,
    store: true,
    price: true,
    stock: true,
    approval: true,
    status: true,
    action: true,
  });
  const columnDropdownRef = useRef<HTMLDivElement>(null);

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("Fruits & Vegetables");
  const [formStore, setFormStore] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscount, setFormDiscount] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formIsApproved, setFormIsApproved] = useState(false);

  // ─── Computed ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }
    if (approvalFilter !== "all") {
      result = result.filter(p => approvalFilter === "approved" ? p.isApproved : !p.isApproved);
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
  }, [products, searchQuery, statusFilter, approvalFilter, sortConfig]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentRows = filtered.slice(startIdx, startIdx + itemsPerPage);

  const activeCount = products.filter(p => p.status === "active").length;
  const pendingApprovalCount = products.filter(p => !p.isApproved).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 15).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleSort = (key: keyof Product) => {
    setSortConfig(prev => prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
    toast.success("Status updated!");
  };

  const toggleApproval = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isApproved: !p.isApproved } : p));
    toast.success("Approval status updated!");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    toast.success("Product deleted!");
  };

  const resetForm = () => { 
    setFormName(""); 
    setFormBrand(""); 
    setFormCategory("Fruits & Vegetables");
    setFormStore("");
    setFormPrice("");
    setFormDiscount("");
    setFormStock("");
    setFormStatus("active"); 
    setFormIsApproved(false); 
  };

  const openAddModal = () => { resetForm(); setEditingProduct(null); setShowAddModal(true); };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name); 
    setFormBrand(prod.brand); 
    setFormCategory(prod.category);
    setFormStore(prod.store);
    setFormPrice(String(prod.price));
    setFormDiscount(String(prod.discount));
    setFormStock(String(prod.stock));
    setFormStatus(prod.status); 
    setFormIsApproved(prod.isApproved);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) { toast.error("Please fill required fields"); return; }

    const priceNum = parseFloat(formPrice) || 0;
    const discountNum = parseFloat(formDiscount) || 0;
    const stockNum = parseInt(formStock) || 0;

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { 
        ...p, name: formName, brand: formBrand, category: formCategory, store: formStore,
        price: priceNum, discount: discountNum, stock: stockNum, status: formStatus, isApproved: formIsApproved 
      } : p));
      toast.success("Product updated!");
    } else {
      const newProd: Product = { 
        id: `PROD-${String(products.length + 1).padStart(3, "0")}`, 
        name: formName, brand: formBrand, image: "📦", category: formCategory, store: formStore || "In-house",
        price: priceNum, discount: discountNum, stock: stockNum, status: formStatus, isApproved: formIsApproved, 
        createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) 
      };
      setProducts(prev => [newProd, ...prev]);
      toast.success("Product created!");
    }
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d3136] font-sans -mt-6 -mx-6 p-4 md:p-8">

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Master Product Catalog</h1>
          <div className="text-sm text-[#FF6900] flex items-center gap-2 mt-1">
            <Link href="/admin/dashboard" className="hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Products</span>
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
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500"><Package size={16} /></div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">Total Products</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{products.length}</div>
        </div>
        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-500"><Check size={16} /></div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">Active</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{activeCount}</div>
        </div>
        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-500"><AlertTriangle size={16} /></div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">Pending Approval</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{pendingApprovalCount}</div>
        </div>
        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-500"><Archive size={16} /></div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">Stock Alerts</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-gray-800">{outOfStockCount}</div>
            <span className="text-sm text-gray-500 mb-1">out, {lowStockCount} low</span>
          </div>
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
                placeholder="Search products, brands..."
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
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 flex flex-col p-1 gap-1">
                  {Object.keys(visibleColumns).map(key => (
                    <button
                      key={key}
                      onClick={() => toggleColumn(key as keyof typeof visibleColumns)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors capitalize",
                        visibleColumns[key as keyof typeof visibleColumns]
                          ? "bg-[#FF6900]/10 text-[#FF6900] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {key}
                      {visibleColumns[key as keyof typeof visibleColumns] && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="relative ml-1">
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900]">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={approvalFilter} onChange={(e) => { setApprovalFilter(e.target.value as any); setCurrentPage(1); }} className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900]">
                <option value="all">All Approval</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={14} /> Export
            </button>
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
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900] cursor-pointer"
                    checked={currentRows.length > 0 && currentRows.every(p => selectedProducts.includes(p.id))}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">ID {sortConfig?.key === "id" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                </th>
                {visibleColumns.product && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">Product {sortConfig?.key === "name" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.category && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("category")}>
                    <div className="flex items-center gap-1">Category {sortConfig?.key === "category" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.store && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("store")}>
                    <div className="flex items-center gap-1">Store {sortConfig?.key === "store" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.price && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-1">Price {sortConfig?.key === "price" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.stock && (
                  <th className="px-4 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleSort("stock")}>
                    <div className="flex items-center gap-1">Stock {sortConfig?.key === "stock" && <span className="text-xs">{sortConfig.dir === "asc" ? "▲" : "▼"}</span>}</div>
                  </th>
                )}
                {visibleColumns.approval && <th className="px-4 py-3">Approval</th>}
                {visibleColumns.status && <th className="px-4 py-3">Status</th>}
                {visibleColumns.action && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((prod, idx) => (
                <tr key={prod.id} className={cn("border-b border-gray-100 transition-colors hover:bg-[#FF6900]/[0.02]", idx % 2 === 0 && "bg-gray-50/30", selectedProducts.includes(prod.id) && "bg-[#FF6900]/5")}>
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900] cursor-pointer"
                      checked={selectedProducts.includes(prod.id)}
                      onChange={() => toggleSelect(prod.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-[12px]">{prod.id}</td>
                  
                  {visibleColumns.product && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm">{prod.image}</div>
                        <div>
                          <p className="font-medium text-gray-800">{prod.name}</p>
                          <p className="text-[11px] text-gray-500">{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.category && <td className="px-4 py-3 text-gray-600">{prod.category}</td>}
                  {visibleColumns.store && <td className="px-4 py-3 text-gray-600 font-medium">{prod.store}</td>}
                  
                  {visibleColumns.price && (
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">₹{prod.price}</div>
                      {prod.discount > 0 && <div className="text-[11px] text-emerald-500 font-medium">{prod.discount}% OFF</div>}
                    </td>
                  )}
                  
                  {visibleColumns.stock && (
                    <td className="px-4 py-3">
                      {prod.stock === 0 ? (
                         <span className="text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-1 rounded">Out of Stock</span>
                      ) : prod.stock <= 15 ? (
                         <span className="text-[11px] font-semibold bg-orange-50 text-orange-600 px-2 py-1 rounded">Low ({prod.stock})</span>
                      ) : (
                         <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">In Stock ({prod.stock})</span>
                      )}
                    </td>
                  )}
                  
                  {visibleColumns.approval && (
                    <td className="px-4 py-3">
                      {prod.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><Check size={12}/> Approved</span>
                      ) : (
                        <button onClick={() => toggleApproval(prod.id)} className="text-[11px] font-semibold bg-[#FF6900]/10 text-[#FF6900] hover:bg-[#FF6900]/20 px-2 py-1 rounded transition-colors">Approve</button>
                      )}
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(prod.id)} className="group flex items-center gap-1.5">
                        {prod.status === "active" ? (
                          <> <ToggleRight size={20} className="text-emerald-500" /> <span className="text-[11px] font-semibold text-emerald-600">Active</span> </>
                        ) : (
                          <> <ToggleLeft size={20} className="text-gray-400" /> <span className="text-[11px] font-semibold text-gray-400">Inactive</span> </>
                        )}
                      </button>
                    </td>
                  )}
                  
                  {visibleColumns.action && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(prod)} className="p-1.5 rounded-md hover:bg-[#FF6900]/10 text-gray-400 hover:text-[#FF6900] transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(prod.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400">No products found matching criteria.</td>
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
              <h3 className="text-lg font-bold text-[#1f2937]">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-red-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                  </div>
                  {/* Brand */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Brand / Subtitle</label>
                    <input type="text" value={formBrand} onChange={(e) => setFormBrand(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Category</label>
                    <div className="relative">
                      <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full appearance-none px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* Store */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Store / Vendor</label>
                    <input type="text" value={formStore} onChange={(e) => setFormStore(e.target.value)} placeholder="Leave blank for In-house" className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                  </div>
                  
                  {/* Price & Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Base Price (₹) <span className="text-red-500">*</span></label>
                      <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Discount (%)</label>
                      <input type="number" value={formDiscount} onChange={(e) => setFormDiscount(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Image */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1">Product Images</label>
                    <div className="border-2 border-dashed border-[#d1d5db] rounded-lg p-6 flex flex-col items-center justify-center bg-[#f8f9fa] hover:bg-gray-50 cursor-pointer transition-colors mt-2 h-[155px]">
                      <Upload size={28} className="text-[#6c757d] mb-2" />
                      <p className="text-sm font-medium text-[#6c757d]">Drop images here to upload</p>
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Inventory Stock</label>
                    <input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#FF6900]" />
                  </div>

                  {/* Status & Approval Toggles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Visibility Status</label>
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
                        <button type="button" onClick={() => setFormStatus("inactive")} className={cn("px-4 py-2 text-sm flex items-center gap-2 transition-colors", formStatus === "inactive" ? "bg-white text-gray-700" : "bg-white text-gray-500 hover:bg-gray-50")}>
                          <span className={cn("w-3 h-3 rounded-full border border-gray-400", formStatus === "inactive" ? "border-2 border-gray-700" : "")} /> Hide
                        </button>
                        <div className="w-px h-full bg-gray-300" />
                        <button type="button" onClick={() => setFormStatus("active")} className={cn("px-4 py-2 text-sm flex items-center gap-2 transition-colors", formStatus === "active" ? "bg-[#10b981] text-white" : "bg-white text-gray-500 hover:bg-gray-50")}>
                          <span className={cn("w-3 h-3 rounded-full border border-current", formStatus === "active" ? "bg-white border-none shadow-[inset_0_0_0_2px_#10b981]" : "border-gray-400")} /> Show
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#5c6873] mb-1.5">Verification</label>
                      <button type="button" onClick={() => setFormIsApproved(!formIsApproved)} className={cn("w-full flex items-center justify-center gap-2 px-3 py-2 border rounded text-sm font-medium transition-colors h-[38px]", formIsApproved ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-orange-50 border-orange-200 text-orange-600")}>
                        {formIsApproved ? <><Check size={14} /> Approved</> : "Pending Review"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-[#f8f9fa] rounded-b-lg">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 bg-[#FF6900] text-white rounded text-sm font-medium hover:bg-[#e55f00] transition-colors">Save Product</button>
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
                <h3 className="font-semibold text-gray-800">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => deleteProduct(showDeleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
