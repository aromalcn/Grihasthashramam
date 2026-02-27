'use client';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0 // approximate via orders or profiles if accessible
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Products Count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch Orders
        const { data: orders, count: orderCount } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        // Calculate Revenue from local orders data (simple total)
        // Note: For large datasets, use a database function or summary table
        const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total_price || 0), 0) || 0;

        setStats({
          products: productCount || 0,
          orders: orderCount || (orders?.length || 0),
          revenue: totalRevenue,
          users: 0 // Placeholder/TODO
        });

        if (orders) {
          setRecentOrders(orders.slice(0, 5));
        }

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.grid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Revenue</span>
          <div className={styles.kpiValue}>₹{stats.revenue.toLocaleString()}</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Orders</span>
          <div className={styles.kpiValue}>{stats.orders}</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Products</span>
          <div className={styles.kpiValue}>{stats.products}</div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-brown-deep)' }}>Recent Orders</h2>
        
        {recentOrders.length > 0 ? (
          <div className={styles.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>ID</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Product</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Amount</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Status</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order.id.slice(0,8)}</td>
                    <td style={{ padding: '0.75rem' }}>{order.product_name}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>₹{order.total_price?.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: order.status === 'paid' ? '#dcfce7' : '#f3f4f6',
                        color: order.status === 'paid' ? '#166534' : '#374151',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>No orders found.</p>
        )}
      </div>
    </div>
  );
}
