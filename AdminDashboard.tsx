import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [newVehicle, setNewVehicle] = useState({ vin: '', make: '', model: '', year: 2022, price: 0, status: 'available', km: 0 });

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    const querySnapshot = await getDocs(collection(db, 'inventory'));
    const vehiclesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVehicles(vehiclesData);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'inventory'), newVehicle);
    setNewVehicle({ vin: '', make: '', model: '', year: 2022, price: 0, status: 'available', km: 0 });
    fetchVehicles();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'inventory', id));
    fetchVehicles();
  };

  return (
    <div className="p-8 bg-shery-dark min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-shery-gold">Panel Administrativo</h1>
      
      <div className="bg-shery-dark-card p-6 rounded-2xl border border-neutral-800 mb-8">
        <h2 className="text-xl font-bold mb-4">Agregar Vehículo</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <input placeholder="VIN" className="bg-neutral-800 p-2 rounded" value={newVehicle.vin} onChange={e => setNewVehicle({...newVehicle, vin: e.target.value})} />
            <input placeholder="Marca" className="bg-neutral-800 p-2 rounded" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} />
            <input placeholder="Modelo" className="bg-neutral-800 p-2 rounded" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
            <input type="number" placeholder="Precio" className="bg-neutral-800 p-2 rounded" value={newVehicle.price} onChange={e => setNewVehicle({...newVehicle, price: Number(e.target.value)})} />
            <button type="submit" className="bg-shery-gold text-black font-bold p-2 rounded col-span-2">Agregar</button>
        </form>
      </div>

      <div className="bg-shery-dark-card p-6 rounded-2xl border border-neutral-800">
        <h2 className="text-xl font-bold mb-4">Inventario</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="pb-2">Marca</th>
              <th className="pb-2">Modelo</th>
              <th className="pb-2">Precio (Gs.)</th>
              <th className="pb-2">Estado</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v: any) => (
              <tr key={v.id} className="border-b border-neutral-800">
                <td className="py-3">{v.make}</td>
                <td className="py-3">{v.model}</td>
                <td className="py-3">{v.price.toLocaleString('es-PY')}</td>
                <td className="py-3 capitalize">{v.status}</td>
                <td className="py-3">
                    <button onClick={() => handleDelete(v.id)} className="text-red-500">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
