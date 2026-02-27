'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  product_name: string;
  quantity: number;
  user_id: string;
  user_email?: string; 
  user_full_name?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    
    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setLoading(false);
        return;
    }

    // Fetch user details for these orders to show emails
    // A better way would be a join if RLS/Foreign Keys allow, doing manual fetch for MVP stability
    const userIds = Array.from(new Set(ordersData.map((o: any) => o.user_id)));
    
    // We can try to fetch emails from profiles if available, or auth.users (admin only)
    // Since we don't have direct access to auth.users in client without specific admin API, 
    // we'll rely on what's in 'profiles' table which should be public/readable.
    
    let profilesMap: Record<string, { email: string, name: string }> = {};
    if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds);
        
        if (profilesData) {
            profilesData.forEach((p: any) => {
                profilesMap[p.id] = {
                    email: p.email || 'No Email',
                    name: p.full_name || 'Unknown Name'
                };
            });
        }
    }

    const formattedOrders = ordersData.map((order: any) => ({
        ...order,
        user_email: profilesMap[order.user_id]?.email || 'N/A',
        user_full_name: profilesMap[order.user_id]?.name || 'Unknown User'
    }));

    setOrders(formattedOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
      try {
          const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);
          
          if (error) throw error;

          // Update local state
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } catch (err) {
          console.error('Error updating status:', err);
          alert('Failed to update status.');
      }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Orders</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Filter:</span>
            <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div>Loading orders...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', color: '#666' }}>Order ID</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Customer</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Items</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Total</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Date</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order.id.slice(0,8)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: '#666' }}>Name: </span>
                        <span style={{ fontWeight: '500' }}>{order.user_full_name}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                         <span style={{ color: '#666' }}>Email: </span>
                         <span>{order.user_email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>{order.product_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>Qty: {order.quantity}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>₹{order.total_price.toLocaleString()}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          style={{ 
                              padding: '0.4rem', 
                              borderRadius: '4px', 
                              border: '1px solid #ddd',
                              backgroundColor: order.status === 'paid' ? '#dcfce7' : 
                                               order.status === 'shipped' ? '#dbeafe' : 
                                               order.status === 'delivered' ? '#f3e8ff' : '#f3f4f6',
                              color: 'var(--color-text-main)',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                          }}
                      >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
