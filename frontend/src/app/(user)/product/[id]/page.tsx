export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">Product Details</h1>
      <p className="text-gray-500">Details for product ID: {params.id}</p>
    </div>
  );
}
