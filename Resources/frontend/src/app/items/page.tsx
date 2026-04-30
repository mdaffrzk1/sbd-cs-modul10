"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipe data berdasarkan struktur tabel items di backend
interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mengecek apakah user sudah login dengan mengecek ada/tidaknya token
    const token = localStorage.getItem("token");
    if (!token) {
      // router.push("/login");
    }

    const fetchItems = async () => {
      try {
        // Melakukan fetch langsung ke endpoint backend
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data barang.");
        }

        setItems(data.payload);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Helper untuk format angka ke Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const getImageUrl = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('laptop')) return "https://id-test-11.slatic.net/p/f5a1afca75bfc5f8cf2921174e69869d.jpg";
    if (lowerName.includes('mouse')) return "https://png.pngtree.com/background/20230925/original/pngtree-computer-mouse-funny-animals-rat-photo-picture-image_5215309.jpg";
    if (lowerName.includes('keyboard')) return "https://teknoform.dinamika.ac.id/upload/koleksi/tik%20royal-5hE5C.jpg";
    if (lowerName.includes('monitor')) return "https://awsimages.detik.net.id/customthumb/2013/08/14/4/crttv.jpg?w=600&q=90";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold tracking-tight">Toko Serba Ga Ada</h1>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900">Daftar Barang</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Belum ada barang yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col group cursor-pointer"
              >
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4 relative transition-opacity hover:opacity-90">
                  <img 
                    src={getImageUrl(item.name)} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-gray-600 truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-gray-900 mb-3">
                    {formatPrice(item.price)}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xs text-gray-500 font-medium">
                      Stok: <span className={`font-bold ${
                        item.stock > 10 ? "text-green-600" : item.stock > 0 ? "text-amber-500" : "text-red-500"
                      }`}>
                        {item.stock}
                      </span>
                    </p>
                    
                    <button 
                      disabled={item.stock === 0}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        item.stock > 0 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
