"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockFaqs = [
  { id: "FAQ-1", question: "What is the delivery time?", answer: "Delivery is completed under 30 minutes.", status: "active" },
  { id: "FAQ-2", question: "How to become a seller?", answer: "Go to Register page and toggle Sell as Vendor option.", status: "active" },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState(mockFaqs);
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    const newFaq = {
      id: `FAQ-${faqs.length + 1}`,
      question,
      answer,
      status: "active",
    };

    setFaqs([...faqs, newFaq]);
    toast.success("FAQ created successfully!");
    setIsOpen(false);
    setQuestion("");
    setAnswer("");
  };

  const columns = [
    { header: "FAQ ID", accessor: "id" as const },
    { header: "Question", accessor: "question" as const, sortable: true },
    { header: "Answer description", accessor: "answer" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="FAQ manager" subtitle="Create and modify general FAQs page content">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add FAQ
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={faqs} searchKey="question" searchPlaceholder="Search question..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add FAQ">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Question text</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How to track order?"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Answer description</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer details..."
              rows={4}
              className="input !h-auto"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add FAQ
          </button>
        </form>
      </FormModal>
    </div>
  );
}
