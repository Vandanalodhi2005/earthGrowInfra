import { useState, useEffect } from 'react';
import { HiTrash, HiPlus, HiPhotograph, HiEye, HiOutlinePhotograph } from 'react-icons/hi';
import AddGalleryForm from './AddGalleryForm';
import toast from 'react-hot-toast';

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 25;

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setImages(data || []);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            toast.error('Failed to load gallery assets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this visual asset?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Asset Deleted');
                fetchGallery();
            } else {
                toast.error('Failed to delete asset');
            }
        } catch (error) {
            toast.error('Error during deletion');
        }
    };

    // Shared Styles from AdminDashboard
    const mainCardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' };
    const tableHeaderStyle = { textAlign: 'left', padding: '12px 15px', fontSize: '10px', color: '#90A4AE', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', backgroundColor: '#F8F9FA' };
    const tableCellStyle = { padding: '15px', fontSize: '13px', color: '#455A64', borderBottom: '1px solid #F0F0F0' };

    // Search and Pagination Logic
    const filteredImages = images.filter(img => 
        (img.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         img.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         img._id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedImages = filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (showAddForm) {
        return <AddGalleryForm onImageAdded={() => { setShowAddForm(false); fetchGallery(); }} onCancel={() => setShowAddForm(false)} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Gallery Management</h2>
                <button 
                    onClick={() => setShowAddForm(true)}
                    style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                >
                    <HiPlus /> Add New Asset
                </button>
            </div>

            {/* Gallery Table Card */}
            <div style={mainCardStyle}>
                <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '700' }}>Visual Media Portfolio</h4>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
                    <input 
                        type="text" 
                        placeholder="Search by title, category or ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>ASSET PREVIEW</th>
                                <th style={tableHeaderStyle}>ID / FILENAME</th>
                                <th style={tableHeaderStyle}>CATEGORY</th>
                                <th style={tableHeaderStyle}>DATE ADDED</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#90A4AE' }}>Loading media vault...</td></tr>
                            ) : paginatedImages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                        <HiOutlinePhotograph size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
                                        <p>{searchTerm ? 'No assets match your search.' : 'No gallery assets found. Start building your portfolio!'}</p>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {paginatedImages.map(img => (
                                        <tr key={img._id}>
                                            <td style={tableCellStyle}>
                                                <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
                                                    <img src={img.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <p style={{ fontWeight: '600', margin: 0 }}>{img.title || 'Architectural capture'}</p>
                                                <p style={{ fontSize: '10px', color: '#90A4AE', margin: 0 }}>ID: {img._id?.slice(-8).toUpperCase()}</p>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#E3F2FD', color: '#2196F3', textTransform: 'uppercase' }}>
                                                    {img.category || 'General'}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>{new Date(img.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <a href={img.imageUrl} target="_blank" rel="noreferrer" style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><HiEye /></a>
                                                    <button onClick={() => handleDelete(img._id)} style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><HiTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="5">
                                            {totalPages > 1 && (
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px', padding: '15px 0', borderTop: '1px solid #eee' }}>
                                                    <button 
                                                        disabled={currentPage === 1}
                                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                                                    >
                                                        Previous
                                                    </button>
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button 
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GalleryManagement;
