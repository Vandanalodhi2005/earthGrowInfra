import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  HiLogout,
  HiHome,
  HiOfficeBuilding,
  HiChartBar,
  HiCog,
  HiMail,
  HiDocumentText,
  HiPlus,
  HiEye,
  HiTrash,
  HiLocationMarker,
  HiTrendingUp,
  HiUser,
  HiGlobe,
  HiClipboardList,
  HiX,
  HiMenu,
  HiPhotograph,
  HiPencilAlt,
} from 'react-icons/hi';
import AddPropertyForm from './AddPropertyForm';
import AddInvestmentForm from './AddInvestmentForm';
import AddProjectForm from './AddProjectForm';
import GalleryManagement from './GalleryManagement';
import AddTeamMemberForm from './AddTeamMemberForm';
import AddJobPostingForm from './AddJobPostingForm';
import { API_URL } from '../../apiConfig';
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [showAddInvestment, setShowAddInvestment] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddTeamMember, setShowAddTeamMember] = useState(false);
    const [showAddJobPosting, setShowAddJobPosting] = useState(false);
    const [editProperty, setEditProperty] = useState(null);
    const [editInvestment, setEditInvestment] = useState(null);
    const [editProject, setEditProject] = useState(null);
    const [editTeamMember, setEditTeamMember] = useState(null);
    const [editJobPosting, setEditJobPosting] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [properties, setProperties] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [interiorQueries, setInteriorQueries] = useState([]);
    const [candidateApplications, setCandidateApplications] = useState([]);
    const [jobPostings, setJobPostings] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedInteriorQuery, setSelectedInteriorQuery] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [adminSettings, setAdminSettings] = useState({
        newUsername: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Search and Pagination State
    const [searchTerms, setSearchTerms] = useState({
        properties: '',
        investments: '',
        projects: '',
        inquiries: '',
        submissions: '',
        gallery: '',
        team: '',
        interiorQueries: '',
        candidateApplications: '',
        jobPostings: ''
    });
    const [currentPages, setCurrentPages] = useState({
        properties: 1,
        investments: 1,
        projects: 1,
        inquiries: 1,
        submissions: 1,
        gallery: 1,
        team: 1,
        interiorQueries: 1,
        candidateApplications: 1,
        jobPostings: 1
    });
    const ITEMS_PER_PAGE = 25;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [dashRes, propRes, contactRes, projectRes, galleryRes, teamRes, interiorRes, candidateRes, jobPostingsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/dashboard`, { headers }),
                fetch(`${API_URL}/api/properties`, { headers }),
                fetch(`${API_URL}/api/contact`, { headers }),
                fetch(`${API_URL}/api/projects`, { headers }),
                fetch(`${API_URL}/api/gallery`, { headers }),
                fetch(`${API_URL}/api/team-members`, { headers }),
                fetch(`${API_URL}/api/interior-queries`, { headers }),
                fetch(`${API_URL}/api/candidates`, { headers }),
                fetch(`${API_URL}/api/job-postings`, { headers })
            ]);

            if (dashRes.ok) setDashboardData((await dashRes.json()).data);
            if (propRes.ok) setProperties(await propRes.json());
            if (contactRes.ok) setContacts(await contactRes.json());
            if (projectRes.ok) setProjects(await projectRes.json());
            if (galleryRes.ok) setGallery(await galleryRes.json());
            if (teamRes.ok) setTeamMembers(await teamRes.json());
            if (interiorRes.ok) {
                const interiorData = await interiorRes.json();
                setInteriorQueries(Array.isArray(interiorData) ? interiorData : (interiorData.data || []));
            }
            if (candidateRes.ok) {
                const candidateData = await candidateRes.json();
                setCandidateApplications(Array.isArray(candidateData) ? candidateData : (candidateData.data || []));
            }
            if (jobPostingsRes.ok) {
                const jobPostingsData = await jobPostingsRes.json();
                setJobPostings(Array.isArray(jobPostingsData) ? jobPostingsData : (jobPostingsData.data || []));
            }
            
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token || !isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchData();
        
        // Responsive sidebar initial state
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [fetchData, isAuthenticated, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleDeleteProperty = async (id) => {
        if (!confirm('Permanently delete this property?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/properties/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Property Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting property'); }
    };

    const handleDeleteInvestment = async (id) => {
        if (!confirm('Permanently delete this investment?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/investments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Investment Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting investment'); }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Permanently delete this project?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Project Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting project'); }
    };

    const handleDeleteTeamMember = async (id) => {
        if (!confirm('Permanently delete this team member?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/team-members/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Team Member Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting team member'); }
    };

    const handleUpdateInquiryStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/contact/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success(`Status updated to ${newStatus}`);
                fetchData();
                if (selectedInquiry && selectedInquiry._id === id) {
                    setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (e) { toast.error('Error updating status'); }
    };

    const handleViewInquiry = (contact) => {
        setSelectedInquiry(contact);
        if (contact.status === 'unread') {
            handleUpdateInquiryStatus(contact._id, 'read');
        }
    };

    const handleUpdateSubmissionStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/submitted-properties/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success(`Property marked as ${newStatus}`);
                fetchData();
                if (selectedSubmission && selectedSubmission._id === id) {
                    setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (e) { toast.error('Error updating submission status'); }
    };

    const handleDeleteInquiry = async (id) => {
        if (!confirm('Permanently delete this inquiry?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Inquiry Deleted');
                if (selectedInquiry && selectedInquiry._id === id) setSelectedInquiry(null);
                fetchData();
            }
        } catch (e) { toast.error('Error deleting inquiry'); }
    };

    const handleDeleteSubmission = async (id) => {
        if (!confirm('Permanently delete this submission?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/submitted-properties/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Submission Deleted');
                if (selectedSubmission && selectedSubmission._id === id) setSelectedSubmission(null);
                fetchData();
            }
        } catch (e) { toast.error('Error deleting submission'); }
    };

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();
        
        if (adminSettings.newPassword && adminSettings.newPassword !== adminSettings.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!adminSettings.newUsername && !adminSettings.newPassword) {
            toast.error('Please enter at least one field to update');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/admin/update-settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newUsername: adminSettings.newUsername,
                    newPassword: adminSettings.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setAdminSettings({ newUsername: '', newPassword: '', confirmPassword: '' });
                // If username changed, we might want to log out or update user state
                if (adminSettings.newUsername) {
                    toast.success('Username changed. Please note for next login.');
                }
            } else {
                toast.error(data.message || 'Error updating settings');
            }
        } catch (e) {
            toast.error('Error updating settings');
        }
    };

    const handleExportInquiries = () => {
        if (contacts.length === 0) {
            toast.error('No inquiries to export');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
        const csvRows = [
            headers.join(','),
            ...contacts.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.phone}"`,
                `"${c.message ? c.message.replace(/"/g, '""').replace(/\n/g, ' ') : ''}"`,
                `"${c.status}"`,
                `"${new Date(c.createdAt).toLocaleDateString()}"`
            ].join(','))
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Inquiries exported successfully');
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiHome },
        { id: 'properties', label: 'Properties', icon: HiOfficeBuilding },
        { id: 'projects', label: 'Projects', icon: HiClipboardList },
        { id: 'inquiries', label: 'Contact Inquiries', icon: HiMail },
        { id: 'interiorQueries', label: 'Interior Queries', icon: HiOfficeBuilding },
        { id: 'jobPostings', label: 'Job Postings', icon: HiClipboardList },
        { id: 'candidateApplications', label: 'Job Applications', icon: HiUser },
        { id: 'settings', label: 'Settings', icon: HiCog },
        { id: 'gallery', label: 'Gallery', icon: HiPhotograph },
        { id: 'team', label: 'Our Team', icon: HiUser },
    ];

    // Helper for search and pagination
    const getPaginatedData = (data, type, searchFields) => {
        const list = Array.isArray(data) ? data : [];
        const term = searchTerms[type].toLowerCase();
        const filtered = list.filter(item => 
            searchFields.some(field => {
                const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                return value?.toString().toLowerCase().includes(term);
            })
        );
        
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        const startIndex = (currentPages[type] - 1) * ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        
        return { 
            data: paginated, 
            totalPages, 
            totalItems: filtered.length,
            currentPage: currentPages[type]
        };
    };

    const renderPagination = (type, totalPages) => {
        if (totalPages <= 1) return null;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px', padding: '15px 0', borderTop: '1px solid #eee' }}>
                <button 
                    disabled={currentPages[type] === 1}
                    onClick={() => setCurrentPages(prev => ({ ...prev, [type]: prev[type] - 1 }))}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: currentPages[type] === 1 ? '#f5f5f5' : 'white', cursor: currentPages[type] === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                >
                    Previous
                </button>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>
                    Page {currentPages[type]} of {totalPages}
                </span>
                <button 
                    disabled={currentPages[type] === totalPages}
                    onClick={() => setCurrentPages(prev => ({ ...prev, [type]: prev[type] + 1 }))}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: currentPages[type] === totalPages ? '#f5f5f5' : 'white', cursor: currentPages[type] === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                >
                    Next
                </button>
            </div>
        );
    };

    const renderSearchBar = (type, placeholder) => (
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
            <input 
                type="text" 
                placeholder={placeholder}
                value={searchTerms[type]}
                onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, [type]: e.target.value }));
                    setCurrentPages(prev => ({ ...prev, [type]: 1 }));
                }}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
            />
            <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#90A4AE' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>
    );

    const calculatePercentage = (count, total) => {
        if (!total || total === 0) return 0;
        return Math.round((count / total) * 100);
    };

    const renderDashboard = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            {/* Main Stats Row */}
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
                <div style={premiumStatCard('linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'white')}>
                    <div style={{ flex: 1 }}>
                        <p style={premiumStatTitle}>Total Properties</p>
                        <h3 className="premium-stat-value" style={premiumStatValue}>{properties.length}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>{properties.filter(p => p.status === 'available').length} Available</span>
                        </div>
                    </div>
                    <div style={premiumStatIconBox('rgba(112, 109, 109, 0.86)')}><HiOfficeBuilding size={24} /></div>
                </div>

                <div style={premiumStatCard('linear-gradient(135deg, #F39C12 0%, #E67E22 100%)', 'white')}>
                    <div style={{ flex: 1 }}>
                        <p style={premiumStatTitle}>Total Projects</p>
                        <h3 className="premium-stat-value" style={premiumStatValue}>{projects.length}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>Active Developments</span>
                        </div>
                    </div>
                    <div style={premiumStatIconBox('rgba(255,255,255,0.1)')}><HiClipboardList size={24} /></div>
                </div>

                <div style={premiumStatCard('linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', 'white')}>
                    <div style={{ flex: 1 }}>
                        <p style={premiumStatTitle}>Total Inquiries</p>
                        <h3 className="premium-stat-value" style={premiumStatValue}>{contacts.length}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 'bold' }}>{contacts.filter(c => c.status === 'unread').length} Unread</span>
                        </div>
                    </div>
                    <div style={premiumStatIconBox('rgba(255,255,255,0.1)')}><HiMail size={24} /></div>
                </div>

                <div style={premiumStatCard('linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)', 'white')}>
                    <div style={{ flex: 1 }}>
                        <p style={premiumStatTitle}>Gallery Assets</p>
                        <h3 className="premium-stat-value" style={premiumStatValue}>{gallery.length}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>Visual Media</span>
                        </div>
                    </div>
                    <div style={premiumStatIconBox('rgba(255,255,255,0.1)')}><HiPhotograph size={24} /></div>
                </div>
            </div>

            {/* Project Type Breakdown */}
            <div style={{ ...mainCardStyle, padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--color-navy)', fontWeight: '800' }}>Projects Overview</h3>
                        <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>Distribution of projects by their category</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                         {/* Optional Legend or Filter */}
                    </div>
                </div>

                <div className="type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={typeBreakdownBox('#E3F2FD', '#1976D2')}>
                        <span style={typeLabelStyle}>Residential</span>
                        <h4 style={typeValueStyle}>{dashboardData?.projectsByType?.residential || projects.filter(p => p.category === 'residential' || p.type === 'residential').length}</h4>
                        <div style={progressBarContainer}><div style={progressBar('#1976D2', calculatePercentage(projects.filter(p => p.category === 'residential' || p.type === 'residential').length, projects.length))}></div></div>
                    </div>
                    <div style={typeBreakdownBox('#E8F5E9', '#388E3C')}>
                        <span style={typeLabelStyle}>Commercial</span>
                        <h4 style={typeValueStyle}>{dashboardData?.projectsByType?.commercial || projects.filter(p => p.category === 'commercial' || p.type === 'commercial').length}</h4>
                        <div style={progressBarContainer}><div style={progressBar('#388E3C', calculatePercentage(projects.filter(p => p.category === 'commercial' || p.type === 'commercial').length, projects.length))}></div></div>
                    </div>
                    <div style={typeBreakdownBox('#FFF3E0', '#F57C00')}>
                        <span style={typeLabelStyle}>Investments</span>
                        <h4 style={typeValueStyle}>{dashboardData?.projectsByType?.investment || projects.filter(p => p.category === 'investment' || p.type === 'investment').length}</h4>
                        <div style={progressBarContainer}><div style={progressBar('#F57C00', calculatePercentage(projects.filter(p => p.category === 'investment' || p.type === 'investment').length, projects.length))}></div></div>
                    </div>
                    <div style={typeBreakdownBox('#F3E5F5', '#7B1FA2')}>
                        <span style={typeLabelStyle}>Plot</span>
                        <h4 style={typeValueStyle}>{dashboardData?.projectsByType?.plot || projects.filter(p => p.category === 'plot' || p.type === 'plot').length}</h4>
                        <div style={progressBarContainer}><div style={progressBar('#7B1FA2', calculatePercentage(projects.filter(p => p.category === 'plot' || p.type === 'plot').length, projects.length))}></div></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="recent-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                 <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F0F0F0', paddingBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--color-navy)', fontWeight: '700' }}>Recent Properties</h4>
                        <Link to="#" onClick={() => setActiveTab('properties')} style={{ fontSize: '13px', color: 'var(--color-gold)', fontWeight: '700', textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {properties.length === 0 ? <p style={{ color: '#90A4AE', textAlign: 'center', padding: '20px' }}>No properties found</p> : (
                            properties.slice(0, 5).map(p => (
                                <div key={p._id} style={recentItemRowStyle}>
                                    <div style={recentItemImageStyle}>
                                        {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiOfficeBuilding color="var(--color-navy)" />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={recentItemTitleStyle}>{p.propertyName}</p>
                                        <p style={recentItemSubTitleStyle}>{p.location}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={recentItemPriceStyle}>₹{p.price?.toLocaleString()}</p>
                                        <span style={recentItemStatusStyle(p.status)}>{p.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                 </div>
                 
                 <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F0F0F0', paddingBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--color-navy)', fontWeight: '700' }}>Recent Inquiries</h4>
                        <Link to="#" onClick={() => setActiveTab('inquiries')} style={{ fontSize: '13px', color: 'var(--color-gold)', fontWeight: '700', textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {contacts.length === 0 ? <p style={{ color: '#90A4AE', textAlign: 'center', padding: '20px' }}>No inquiries yet</p> : (
                            contacts.slice(0, 5).map(contact => (
                                <div key={contact._id} style={recentItemRowStyle}>
                                    <div style={recentItemAvatarStyle}><HiUser /></div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={recentItemTitleStyle}>{contact.name}</p>
                                            <span style={{ fontSize: '10px', color: '#90A4AE' }}>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ ...recentItemSubTitleStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.message}</p>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <span style={inquiryBadgeStyle(contact.status)}>{contact.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );

    const renderProperties = () => {
        if (showAddProperty || editProperty) return <AddPropertyForm initialData={editProperty} onCancel={() => { setShowAddProperty(false); setEditProperty(null); }} onSuccess={() => { setShowAddProperty(false); setEditProperty(null); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Property Management</h2>
                    <button 
                        onClick={() => setShowAddProperty(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add New Property
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Properties</h4>
                    </div>
                    
                    {renderSearchBar('properties', 'Search properties by name, location or status...')}

                    <div className="table-container" style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>PROPERTY</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>LOCATION</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const { data: pagedData, totalPages } = getPaginatedData(properties, 'properties', ['propertyName', 'location', 'city', 'status']);
                                    if (pagedData.length === 0) return (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                                {searchTerms.properties ? 'No matches found for your search.' : 'No properties found. Add your first property!'}
                                            </td>
                                        </tr>
                                    );
                                    return (
                                        <>
                                            {pagedData.map(p => (
                                                <tr key={p._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                                    <td style={tableCellStyle}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiOfficeBuilding color="#90A4AE" />}
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{p.propertyName || 'Unnamed Listing'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="mobile-hide" style={tableCellStyle}>{p.location}, {p.city}</td>
                                                    <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>₹{p.price?.toLocaleString()}</td>
                                                    <td className="mobile-hide" style={tableCellStyle}>
                                                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: p.status === 'available' ? '#E8F5E9' : '#FFEBEE', color: p.status === 'available' ? '#4CAF50' : '#F44336', textTransform: 'uppercase' }}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button 
                                                                onClick={() => setSelectedProperty(p)}
                                                                title="View Details"
                                                                style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiEye />
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditProperty(p)}
                                                                title="Edit Property"
                                                                style={{ border: 'none', background: '#FFF8E1', color: '#F39C12', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiPencilAlt />
                                                            </button>
                                                            <button onClick={() => handleDeleteProperty(p._id)} title="Delete" style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="5">
                                                    {renderPagination('properties', totalPages)}
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderInvestments = () => {
        if (showAddInvestment || editInvestment) return <AddInvestmentForm initialData={editInvestment} onCancel={() => { setShowAddInvestment(false); setEditInvestment(null); }} onSuccess={() => { setShowAddInvestment(false); setEditInvestment(null); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Land Investments</h2>
                    <button 
                        onClick={() => setShowAddInvestment(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add Investment
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Investments</h4>
                    </div>

                    {renderSearchBar('investments', 'Search investments by title, location or land type...')}
                    
                    <div className="table-container" style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>TITLE</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>LOCATION</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>TYPE</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const { data: pagedData, totalPages } = getPaginatedData(investments, 'investments', ['title', 'location', 'city', 'landType', 'status']);
                                    if (pagedData.length === 0) return (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                                {searchTerms.investments ? 'No matches found for your search.' : 'No investments found. Add your first investment!'}
                                            </td>
                                        </tr>
                                    );
                                    return (
                                        <>
                                            {pagedData.map(i => (
                                                <tr key={i._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                                    <td style={tableCellStyle}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {i.images?.[0] ? <img src={i.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiGlobe color="#90A4AE" />}
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{i.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="mobile-hide" style={tableCellStyle}>{i.location}, {i.city}</td>
                                                    <td className="mobile-hide" style={{ ...tableCellStyle, textTransform: 'capitalize' }}>{i.landType}</td>
                                                    <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>₹{i.totalPrice?.toLocaleString()}</td>
                                                    <td style={tableCellStyle}>
                                                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: i.status === 'available' ? '#E8F5E9' : i.status === 'upcoming' ? '#E3F2FD' : '#FFEBEE', color: i.status === 'available' ? '#4CAF50' : i.status === 'upcoming' ? '#2196F3' : '#F44336', textTransform: 'uppercase' }}>
                                                            {i.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button 
                                                                onClick={() => setSelectedInvestment(i)}
                                                                title="View Details"
                                                                style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiEye />
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditInvestment(i)}
                                                                title="Edit Investment"
                                                                style={{ border: 'none', background: '#FFF8E1', color: '#F39C12', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiPencilAlt />
                                                            </button>
                                                            <button onClick={() => handleDeleteInvestment(i._id)} title="Delete" style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="6">
                                                    {renderPagination('investments', totalPages)}
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderProjects = () => {
        if (showAddProject || editProject) return <AddProjectForm initialData={editProject} onCancel={() => { setShowAddProject(false); setEditProject(null); }} onSuccess={() => { setShowAddProject(false); setEditProject(null); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Projects Management</h2>
                    <button 
                        onClick={() => setShowAddProject(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add Project
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Projects</h4>
                    </div>

                    {renderSearchBar('projects', 'Search projects by title, location or status...')}
                    
                    <div className="table-container" style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>TITLE</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>LOCATION</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>TYPE</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const { data: pagedData, totalPages } = getPaginatedData(projects, 'projects', ['title', 'location', 'city', 'type', 'status']);
                                    if (pagedData.length === 0) return (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                                {searchTerms.projects ? 'No matches found for your search.' : 'No projects found. Add your first project!'}
                                            </td>
                                        </tr>
                                    );
                                    return (
                                        <>
                                            {pagedData.map(p => (
                                                <tr key={p._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                                    <td style={tableCellStyle}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiClipboardList color="#90A4AE" />}
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{p.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="mobile-hide" style={tableCellStyle}>{p.location}, {p.city}</td>
                                                    <td className="mobile-hide" style={{ ...tableCellStyle, textTransform: 'capitalize' }}>
                                                        {p.category ? `${p.category}${p.type ? ` (${p.type})` : ''}` : p.type}
                                                    </td>
                                                    <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>{p.price}</td>
                                                    <td style={tableCellStyle}>
                                                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: p.status === 'completed' ? '#E8F5E9' : p.status === 'under-construction' ? '#FFF3E0' : '#E3F2FD', color: p.status === 'completed' ? '#4CAF50' : p.status === 'under-construction' ? '#EF6C00' : '#2196F3', textTransform: 'uppercase' }}>
                                                            {p.status?.replace(/-/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button 
                                                                onClick={() => setSelectedProject(p)}
                                                                title="View Details"
                                                                style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiEye />
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditProject(p)}
                                                                title="Edit Project"
                                                                style={{ border: 'none', background: '#FFF8E1', color: '#F39C12', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiPencilAlt />
                                                            </button>
                                                            <button onClick={() => handleDeleteProject(p._id)} title="Delete" style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="6">
                                                    {renderPagination('projects', totalPages)}
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderTeamMembers = () => {
        if (showAddTeamMember || editTeamMember) return <AddTeamMemberForm key={editTeamMember?._id || 'new'} initialData={editTeamMember} onCancel={() => { setShowAddTeamMember(false); setEditTeamMember(null); }} onSuccess={() => { setShowAddTeamMember(false); setEditTeamMember(null); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Team Management</h2>
                    <button 
                        onClick={() => { setEditTeamMember(null); setShowAddTeamMember(true); }}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add Team Member
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Team Members</h4>
                    </div>

                    {renderSearchBar('team', 'Search by name or role...')}
                    
                    <div className="table-container" style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>MEMBER</th>
                                    <th style={tableHeaderStyle}>ROLE</th>
                                    <th className="mobile-hide" style={tableHeaderStyle}>ORDER</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const { data: pagedData, totalPages } = getPaginatedData(teamMembers, 'team', ['name', 'role']);
                                    if (pagedData.length === 0) return (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                                {searchTerms.team ? 'No matches found for your search.' : 'No team members found. Add your first member!'}
                                            </td>
                                        </tr>
                                    );
                                    return (
                                        <>
                                            {pagedData.map(m => (
                                                <tr key={m._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                                    <td style={tableCellStyle}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#F8F9FA', border: '1px solid #EEE' }}>
                                                                <img src={m.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={m.name} />
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{m.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tableCellStyle}>{m.role}</td>
                                                    <td className="mobile-hide" style={tableCellStyle}>{m.order || 0}</td>
                                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button 
                                                                onClick={() => setEditTeamMember(m)}
                                                                title="Edit Member"
                                                                style={{ border: 'none', background: '#FFF8E1', color: '#F39C12', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <HiPencilAlt />
                                                            </button>
                                                            <button onClick={() => handleDeleteTeamMember(m._id)} title="Delete" style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="4">
                                                    {renderPagination('team', totalPages)}
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderInquiries = () => {
        const total = contacts.length;
        const unread = contacts.filter(c => c.status === 'unread').length;
        const responded = contacts.filter(c => c.status === 'responded').length;
        const read = total - unread - responded;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Customer Inquiries</h2>
                    <button 
                        onClick={handleExportInquiries}
                        style={{ backgroundColor: '#F8F9FA', border: '1px solid #E6E9EF', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)', cursor: 'pointer' }}
                    >
                        Export
                    </button>
                </div>

                {/* Inquiry Stats */}
                <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={premiumStatCard('linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Total Inquiries</p><h3 style={premiumStatValue}>{total}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #F44336 0%, #D32F2F 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Unread</p><h3 style={premiumStatValue}>{unread}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Responded</p><h3 style={premiumStatValue}>{responded}</h3></div>
                    </div>
                </div>

                {/* Simple Chart Section */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Inquiry Distribution</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', height: '200px', padding: '20px 0', borderBottom: '1px solid #EEE' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(unread/total)*100 || 0}%`, backgroundColor: '#F44336', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Unread</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(read/total)*100 || 0}%`, backgroundColor: '#2196F3', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Read</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(responded/total)*100 || 0}%`, backgroundColor: '#4CAF50', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Responded</span>
                        </div>
                    </div>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ ...cardHeaderStyle, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 }}>All Inquiries</h4>
                    </div>

                    {renderSearchBar('inquiries', 'Search inquiries by name, email or message...')}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(() => {
                            const { data: pagedData, totalPages } = getPaginatedData(contacts, 'inquiries', ['name', 'email', 'phone', 'message', 'status']);
                            if (pagedData.length === 0) return (
                                <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>
                                    {searchTerms.inquiries ? 'No inquiries match your search.' : 'No inquiries found.'}
                                </p>
                            );
                            return (
                                <>
                                    {pagedData.map(contact => (
                                        <div key={contact._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E6E9EF' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h5 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '800' }}>{contact.name}</h5>
                                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#607D8B' }}>{contact.email} • {contact.phone}</p>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={inquiryBadgeStyle(contact.status)}>{contact.status}</span>
                                                    <span style={{ fontSize: '12px', color: '#90A4AE', fontWeight: '500' }}>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{contact.message}</p>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <button 
                                                    onClick={() => handleDeleteInquiry(contact._id)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #F44336', color: '#F44336', padding: '8px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    <HiTrash size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleViewInquiry(contact)}
                                                    style={{ backgroundColor: 'white', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination('inquiries', totalPages)}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderSubmissions = () => {
        const total = submissions.length;
        const pending = submissions.filter(s => s.status === 'pending').length;
        const approved = submissions.filter(s => s.status === 'approved').length;
        const rejected = submissions.filter(s => s.status === 'rejected').length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Property Submissions</h2>
                        <span style={{ backgroundColor: '#FFF3E0', color: '#EF6C00', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{pending} pending</span>
                    </div>
                </div>

                {/* Submission Stats */}
                <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <div style={premiumStatCard('linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'white')}><div style={{ flex: 1 }}><p style={premiumStatTitle}>Total</p><h3 style={premiumStatValue}>{total}</h3></div></div>
                    <div style={premiumStatCard('linear-gradient(135deg, #EF6C00 0%, #E65100 100%)', 'white')}><div style={{ flex: 1 }}><p style={premiumStatTitle}>Pending</p><h3 style={premiumStatValue}>{pending}</h3></div></div>
                    <div style={premiumStatCard('linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', 'white')}><div style={{ flex: 1 }}><p style={premiumStatTitle}>Approved</p><h3 style={premiumStatValue}>{approved}</h3></div></div>
                    <div style={premiumStatCard('linear-gradient(135deg, #F44336 0%, #D32F2F 100%)', 'white')}><div style={{ flex: 1 }}><p style={premiumStatTitle}>Rejected</p><h3 style={premiumStatValue}>{rejected}</h3></div></div>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ ...cardHeaderStyle, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 }}>All Submissions</h4>
                    </div>

                    {renderSearchBar('submissions', 'Search submissions by title, contact name or location...')}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(() => {
                            const { data: pagedData, totalPages } = getPaginatedData(submissions, 'submissions', ['title', 'contactName', 'contactEmail', 'location', 'category', 'status']);
                            if (pagedData.length === 0) return (
                                <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>
                                    {searchTerms.submissions ? 'No submissions match your search.' : 'No submissions found.'}
                                </p>
                            );
                            return (
                                <>
                                    {pagedData.map(sub => (
                                        <div key={sub._id} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px', backgroundColor: '#F8F9FA', borderRadius: '15px', border: '1px solid #E6E9EF' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                                                <div>
                                                    <h5 style={{ margin: 0, fontSize: '18px', color: 'var(--color-navy)', fontWeight: '800' }}>{sub.title}</h5>
                                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#607D8B' }}>{sub.contactName} • {sub.contactEmail} • {sub.contactPhone}</p>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={{ padding: '6px 15px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: sub.status === 'pending' ? '#FFF3E0' : sub.status === 'approved' ? '#E8F5E9' : sub.status === 'rejected' ? '#FFEBEE' : '#E3F2FD', color: sub.status === 'pending' ? '#EF6C00' : sub.status === 'approved' ? '#4CAF50' : sub.status === 'rejected' ? '#F44336' : '#2196F3' }}>
                                                        {sub.status}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: '#90A4AE' }}>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '10px' }}>
                                                <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Category</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'capitalize' }}>{sub.category}</p></div>
                                                <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Type</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'capitalize' }}>{sub.type}</p></div>
                                                <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Price</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-gold)' }}>₹{sub.price?.toLocaleString()}</p></div>
                                                <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Location</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>{sub.location}</p></div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <button 
                                                    onClick={() => handleDeleteSubmission(sub._id)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #F44336', color: '#F44336', padding: '10px 15px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                                                >
                                                    <HiTrash size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedSubmission(sub)}
                                                    style={{ backgroundColor: 'white', border: '1px solid var(--color-navy)', color: 'var(--color-navy)', padding: '10px 25px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination('submissions', totalPages)}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderAnalytics = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Analytics & Reports</h2>

                {/* Website Traffic */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Website Traffic</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#F0F4F8', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#607D8B', textTransform: 'uppercase' }}>Recent Listings</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800' }}>{dashboardData?.recentProperties || 0}</h3>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#E3F2FD', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#2196F3', textTransform: 'uppercase' }}>Active Inquiries</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: '#2196F3', fontWeight: '800' }}>{dashboardData?.unreadContacts || 0}</h3>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#E8F5E9', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#4CAF50', textTransform: 'uppercase' }}>Total Data Points</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: '#4CAF50', fontWeight: '800' }}>{properties.length + investments.length + projects.length}</h3>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Popular Properties */}
                    <div style={mainCardStyle}>
                        <h4 style={cardHeaderStyle}>Popular Properties</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {properties.slice(0, 3).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#F8F9FA', borderRadius: '10px' }}>
                                    <div style={{ width: '8px', height: '35px', backgroundColor: idx === 0 ? 'var(--color-gold)' : idx === 1 ? '#2196F3' : '#9C27B0', borderRadius: '4px' }}></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>{item.propertyName}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#607D8B' }}>{item.location}</p>
                                    </div>
                                    <HiTrendingUp color={idx === 0 ? 'var(--color-gold)' : idx === 1 ? '#2196F3' : '#9C27B0'} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lead Sources */}
                    <div style={mainCardStyle}>
                        <h4 style={cardHeaderStyle}>Lead Sources</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { name: 'Residential', value: Math.round((properties.length / (properties.length + investments.length + projects.length || 1)) * 100), color: 'var(--color-navy)' },
                                { name: 'Land/Plot', value: Math.round((investments.length / (properties.length + investments.length + projects.length || 1)) * 100), color: 'var(--color-gold)' },
                                { name: 'Commercial', value: Math.round((projects.length / (properties.length + investments.length + projects.length || 1)) * 100), color: '#4CAF50' }
                            ].map((source, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#455A64' }}>{source.name}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '800', color: source.color }}>{source.value}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#ECEFF1', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${source.value}%`, height: '100%', backgroundColor: source.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Performance Chart */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Monthly Performance</h4>
                    <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0', overflowX: 'auto' }}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                            const height = [40, 60, 45, 80, 95, 75, 85, 90, 70, 85, 95, 100][idx];
                            return (
                                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '40px' }}>
                                    <div style={{ width: '100%', height: `${height}%`, backgroundColor: month === 'Dec' ? 'var(--color-gold)' : 'var(--color-navy)', borderRadius: '6px 6px 0 0', opacity: 0.8, transition: 'all 0.3s' }}></div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#90A4AE' }}>{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderSettings = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>System Settings</h2>

                {/* General Settings placeholder */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>General Settings</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Company Name</label>
                            <input type="text" defaultValue="The realty Xperts" style={{ ...inputFieldStyle }} readOnly />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Contact Email</label>
                            <input type="email" defaultValue="emailtotrx@gmail.com" style={{ ...inputFieldStyle }} readOnly />
                        </div>
                    </div>
                </div>

                {/* Admin Accounts Credentials */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Admin Credentials</h4>
                    <form onSubmit={handleUpdateCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>New Username</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter new username" 
                                    value={adminSettings.newUsername}
                                    onChange={(e) => setAdminSettings({...adminSettings, newUsername: e.target.value})}
                                    style={inputFieldStyle} 
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    value={adminSettings.newPassword}
                                    onChange={(e) => setAdminSettings({...adminSettings, newPassword: e.target.value})}
                                    style={inputFieldStyle} 
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Confirm new password" 
                                    value={adminSettings.confirmPassword}
                                    onChange={(e) => setAdminSettings({...adminSettings, confirmPassword: e.target.value})}
                                    style={inputFieldStyle} 
                                />
                            </div>
                        </div>
                        <button type="submit" style={{ ...actionButtonStyle, maxWidth: '200px', backgroundColor: 'var(--color-navy)' }}>Update Credentials</button>
                    </form>
                </div>
            </div>
        );
    };

    const renderSubmissionModal = () => {
        if (!selectedSubmission) return null;

        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <button 
                        onClick={() => setSelectedSubmission(null)}
                        style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#607D8B', zIndex: 10 }}
                    >
                        <HiX size={18} />
                    </button>

                    <div className="modal-content" style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Property Submission</span>
                            <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>{selectedSubmission.title}</h3>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: selectedSubmission.status === 'pending' ? '#FFF3E0' : selectedSubmission.status === 'approved' ? '#E8F5E9' : '#FFEBEE', color: selectedSubmission.status === 'pending' ? '#EF6C00' : selectedSubmission.status === 'approved' ? '#4CAF50' : '#F44336' }}>{selectedSubmission.status}</span>
                                <span style={{ color: '#90A4AE', fontSize: '13px' }}>Submitted on {new Date(selectedSubmission.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Contact Person</p>
                                <p style={detailValueStyle}>{selectedSubmission.contactName}</p>
                            </div>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Email</p>
                                <p style={detailValueStyle}>{selectedSubmission.contactEmail}</p>
                            </div>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Phone</p>
                                <p style={detailValueStyle}>{selectedSubmission.contactPhone}</p>
                            </div>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Category</p>
                                <p style={{ ...detailValueStyle, textTransform: 'capitalize' }}>{selectedSubmission.category}</p>
                            </div>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Property Type</p>
                                <p style={{ ...detailValueStyle, textTransform: 'capitalize' }}>{selectedSubmission.type}</p>
                            </div>
                            <div style={detailBoxStyle}>
                                <p style={detailLabelStyle}>Price</p>
                                <p style={{ ...detailValueStyle, color: 'var(--color-gold)' }}>₹{selectedSubmission.price?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div style={{ background: '#F8F9FA', padding: '25px', borderRadius: '20px', marginBottom: '40px' }}>
                            <p style={detailLabelStyle}>Location</p>
                            <p style={{ ...detailValueStyle, marginBottom: '20px' }}>{selectedSubmission.location}</p>
                            <p style={detailLabelStyle}>Description</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{selectedSubmission.description}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {selectedSubmission.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleUpdateSubmissionStatus(selectedSubmission._id, 'approved')}
                                        style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateSubmissionStatus(selectedSubmission._id, 'rejected')}
                                        style={{ flex: 1, backgroundColor: '#F44336', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => window.location.href = `mailto:${selectedSubmission.contactEmail}`}
                                style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Contact Submitter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderInquiryModal = () => {
        if (!selectedInquiry) return null;

        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                    <button 
                        onClick={() => setSelectedInquiry(null)}
                        style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#607D8B', zIndex: 10 }}
                    >
                        <HiX size={18} />
                    </button>

                    <div className="modal-content" style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Inquiry Details</span>
                            <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>{selectedInquiry.name}</h3>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: selectedInquiry.status === 'unread' ? '#FFEBEE' : selectedInquiry.status === 'responded' ? '#E8F5E9' : '#E3F2FD', color: selectedInquiry.status === 'unread' ? '#F44336' : selectedInquiry.status === 'responded' ? '#4CAF50' : '#2196F3' }}>
                                    {selectedInquiry.status}
                                </span>
                                <span style={{ color: '#90A4AE', fontSize: '13px' }}>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: '#F8F9FA', padding: '15px', borderRadius: '12px' }}>
                                <p style={{ fontSize: '11px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Email Address</p>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-navy)', wordBreak: 'break-all' }}>{selectedInquiry.email}</p>
                            </div>
                            <div style={{ background: '#F8F9FA', padding: '15px', borderRadius: '12px' }}>
                                <p style={{ fontSize: '11px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Phone Number</p>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-navy)' }}>{selectedInquiry.phone}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ fontSize: '11px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Message Content</p>
                            <div style={{ background: '#F8F9FA', padding: '24px', borderRadius: '15px', borderLeft: '4px solid var(--color-gold)', lineHeight: '1.8', color: '#455A64', fontSize: '15px' }}>
                                {selectedInquiry.message}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {selectedInquiry.status !== 'responded' && (
                                <button 
                                    onClick={() => handleUpdateInquiryStatus(selectedInquiry._id, 'responded')}
                                    style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)' }}
                                >
                                    Mark as Responded
                                </button>
                            )}
                            <button 
                                onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                                style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderInteriorQueries = () => {
        const total = interiorQueries.length;
        const newQueries = interiorQueries.filter(q => q.status === 'new').length;
        const contacted = interiorQueries.filter(q => q.status === 'contacted').length;
        const converted = interiorQueries.filter(q => q.status === 'converted').length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Interior Queries</h2>

                <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={premiumStatCard('linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Total Queries</p><h3 style={premiumStatValue}>{total}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #F44336 0%, #D32F2F 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>New</p><h3 style={premiumStatValue}>{newQueries}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Contacted</p><h3 style={premiumStatValue}>{contacted}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Converted</p><h3 style={premiumStatValue}>{converted}</h3></div>
                    </div>
                </div>

                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>All Interior Queries</h4>
                    {renderSearchBar('interiorQueries', 'Search by name, email, phone or service type...')}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(() => {
                            const { data: pagedData, totalPages } = getPaginatedData(interiorQueries, 'interiorQueries', ['fullName', 'email', 'phone', 'serviceType', 'message', 'status']);
                            if (pagedData.length === 0) return (
                                <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>
                                    {searchTerms.interiorQueries ? 'No queries match your search.' : 'No interior queries yet.'}
                                </p>
                            );
                            return (
                                <>
                                    {pagedData.map(query => (
                                        <div key={query._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E6E9EF' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                                <div>
                                                    <h5 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '800' }}>{query.fullName}</h5>
                                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#607D8B' }}>{query.email} • {query.phone}</p>
                                                    <span style={{ backgroundColor: '#E3F2FD', color: '#1976D2', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{query.serviceType}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={statusBadgeStyle(query.status)}>{query.status}</span>
                                                    <span style={{ fontSize: '12px', color: '#90A4AE', fontWeight: '500' }}>{new Date(query.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{query.message}</p>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                                                <select
                                                    value={query.status}
                                                    onChange={(e) => updateInteriorQueryStatus(query._id, e.target.value)}
                                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', backgroundColor: 'white' }}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="converted">Converted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => deleteInteriorQuery(query._id)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #F44336', color: '#F44336', padding: '8px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    <HiTrash size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedInteriorQuery(query)}
                                                    style={{ backgroundColor: 'white', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination('interiorQueries', totalPages)}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderCandidateApplications = () => {
        const total = candidateApplications.length;
        const applied = candidateApplications.filter(a => a.status === 'applied').length;
        const shortlisted = candidateApplications.filter(a => a.status === 'shortlisted').length;
        const hired = candidateApplications.filter(a => a.status === 'hired').length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Job Applications</h2>

                <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={premiumStatCard('linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Total Applications</p><h3 style={premiumStatValue}>{total}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #F44336 0%, #D32F2F 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Applied</p><h3 style={premiumStatValue}>{applied}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Shortlisted</p><h3 style={premiumStatValue}>{shortlisted}</h3></div>
                    </div>
                    <div style={premiumStatCard('linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)', 'white')}>
                        <div style={{ flex: 1 }}><p style={premiumStatTitle}>Hired</p><h3 style={premiumStatValue}>{hired}</h3></div>
                    </div>
                </div>

                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>All Applications</h4>
                    {renderSearchBar('candidateApplications', 'Search by name, email, mobile or position...')}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(() => {
                            const { data: pagedData, totalPages } = getPaginatedData(candidateApplications, 'candidateApplications', ['fullName', 'email', 'mobile', 'position', 'location', 'message', 'status']);
                            if (pagedData.length === 0) return (
                                <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>
                                    {searchTerms.candidateApplications ? 'No applications match your search.' : 'No job applications yet.'}
                                </p>
                            );
                            return (
                                <>
                                    {pagedData.map(app => (
                                        <div key={app._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E6E9EF' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                                <div>
                                                    <h5 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '800' }}>{app.fullName}</h5>
                                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#607D8B' }}>{app.email} • {app.mobile}</p>
                                                    <span style={{ backgroundColor: '#E3F2FD', color: '#1976D2', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{app.position} — {app.location}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={statusBadgeStyle(app.status)}>{app.status}</span>
                                                    <span style={{ fontSize: '12px', color: '#90A4AE', fontWeight: '500' }}>{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#607D8B' }}>
                                                <span><strong>Experience:</strong> {app.experience} years</span>
                                            </div>
                                            {app.message && (
                                                <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{app.message}</p>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', backgroundColor: 'white' }}
                                                >
                                                    <option value="applied">Applied</option>
                                                    <option value="reviewed">Reviewed</option>
                                                    <option value="shortlisted">Shortlisted</option>
                                                    <option value="rejected">Rejected</option>
                                                    <option value="hired">Hired</option>
                                                </select>
                                                <button
                                                    onClick={() => deleteApplication(app._id)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #F44336', color: '#F44336', padding: '8px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    <HiTrash size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    style={{ backgroundColor: 'white', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination('candidateApplications', totalPages)}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderJobPostings = () => {
        if (showAddJobPosting || editJobPosting) {
            return (
                <AddJobPostingForm
                    initialData={editJobPosting}
                    onCancel={() => { setShowAddJobPosting(false); setEditJobPosting(null); }}
                    onSuccess={() => { setShowAddJobPosting(false); setEditJobPosting(null); fetchData(); }}
                />
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Job Postings Management</h2>
                    <button
                        onClick={() => setShowAddJobPosting(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add New Job Posting
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Job Postings</h4>
                    </div>

                    {renderSearchBar('jobPostings', 'Search job postings by title, location...')}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(() => {
                            const { data: pagedData, totalPages } = getPaginatedData(jobPostings, 'jobPostings', ['title', 'location', 'experience', 'jobTiming', 'status']);
                            if (pagedData.length === 0) return (
                                <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>
                                    {searchTerms.jobPostings ? 'No job postings match your search.' : 'No job postings yet.'}
                                </p>
                            );
                            return (
                                <>
                                    {pagedData.map(posting => (
                                        <div key={posting._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E6E9EF' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                                <div>
                                                    <h5 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '800' }}>{posting.title}</h5>
                                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#607D8B' }}>{posting.location} • {posting.jobTiming}</p>
                                                    <span style={{ backgroundColor: '#E3F2FD', color: '#1976D2', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{posting.experience} • {posting.numberOfOpenings} openings</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={statusBadgeStyle(posting.status)}>{posting.status}</span>
                                                    <span style={{ fontSize: '12px', color: '#90A4AE', fontWeight: '500' }}>{new Date(posting.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#607D8B' }}>
                                                {posting.salary && <span><strong>Salary:</strong> {posting.salary}</span>}
                                            </div>
                                            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{posting.description}</p>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handleDeleteJobPosting(posting._id)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #F44336', color: '#F44336', padding: '8px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    <HiTrash size={14} />
                                                </button>
                                                <button
                                                    onClick={() => { setEditJobPosting(posting); setShowAddJobPosting(true); }}
                                                    style={{ backgroundColor: 'white', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    <HiPencilAlt size={14} /> Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination('jobPostings', totalPages)}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderInteriorQueryModal = () => {
        if (!selectedInteriorQuery) return null;
        const q = selectedInteriorQuery;

        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                    <button onClick={() => setSelectedInteriorQuery(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#607D8B', zIndex: 10 }}>
                        <HiX size={18} />
                    </button>
                    <div className="modal-content" style={{ padding: '40px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Interior Query</span>
                        <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>{q.fullName}</h3>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', marginBottom: '30px' }}>
                            <span style={statusBadgeStyle(q.status)}>{q.status}</span>
                            <span style={{ color: '#90A4AE', fontSize: '13px' }}>{new Date(q.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Email</p><p style={detailValueStyle}>{q.email}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Phone</p><p style={detailValueStyle}>{q.phone}</p></div>
                        </div>
                        <div style={{ ...detailBoxStyle, marginBottom: '20px' }}>
                            <p style={detailLabelStyle}>Service Type</p>
                            <p style={detailValueStyle}>{q.serviceType}</p>
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <p style={detailLabelStyle}>Message</p>
                            <div style={{ background: '#F8F9FA', padding: '24px', borderRadius: '15px', borderLeft: '4px solid var(--color-gold)', lineHeight: '1.8', color: '#455A64', fontSize: '15px' }}>{q.message}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <select
                                value={q.status}
                                onChange={(e) => { updateInteriorQueryStatus(q._id, e.target.value); setSelectedInteriorQuery({ ...q, status: e.target.value }); }}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E6E9EF', fontWeight: '600' }}
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <button onClick={() => window.location.href = `mailto:${q.email}`} style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderApplicationModal = () => {
        if (!selectedApplication) return null;
        const a = selectedApplication;

        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                    <button onClick={() => setSelectedApplication(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#607D8B', zIndex: 10 }}>
                        <HiX size={18} />
                    </button>
                    <div className="modal-content" style={{ padding: '40px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Job Application</span>
                        <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>{a.fullName}</h3>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                            <span style={statusBadgeStyle(a.status)}>{a.status}</span>
                            <span style={{ backgroundColor: '#E3F2FD', color: '#1976D2', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{a.position}</span>
                            <span style={{ color: '#90A4AE', fontSize: '13px' }}>{new Date(a.appliedAt || a.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Email</p><p style={{ ...detailValueStyle, wordBreak: 'break-all' }}>{a.email}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Mobile</p><p style={detailValueStyle}>{a.mobile}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Location</p><p style={detailValueStyle}>{a.location}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Experience</p><p style={detailValueStyle}>{a.experience} years</p></div>
                        </div>
                        {a.message && (
                            <div style={{ marginBottom: '30px' }}>
                                <p style={detailLabelStyle}>Message</p>
                                <div style={{ background: '#F8F9FA', padding: '24px', borderRadius: '15px', borderLeft: '4px solid var(--color-gold)', lineHeight: '1.8', color: '#455A64', fontSize: '15px' }}>{a.message}</div>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <select
                                value={a.status}
                                onChange={(e) => { updateApplicationStatus(a._id, e.target.value); setSelectedApplication({ ...a, status: e.target.value }); }}
                                style={{ flex: 1, minWidth: '140px', padding: '12px', borderRadius: '12px', border: '1px solid #E6E9EF', fontWeight: '600' }}
                            >
                                <option value="applied">Applied</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                            </select>
                            <button onClick={() => window.location.href = `mailto:${a.email}`} style={{ flex: 1, minWidth: '140px', backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const updateInteriorQueryStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/interior-queries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                toast.success('Status updated successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const deleteInteriorQuery = async (id) => {
        if (!window.confirm('Are you sure you want to delete this query?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/interior-queries/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success('Query deleted successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Error deleting query');
        }
    };

    const updateApplicationStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/candidates/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                toast.success('Status updated successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/candidates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success('Application deleted successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Error deleting application');
        }
    };

    const handleDeleteJobPosting = async (id) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/job-postings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Job posting deleted successfully');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting job posting'); }
    };

    const renderContent = () => {
        if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#90A4AE' }}>Loading System Data...</div>;
        if (activeTab === 'dashboard') return renderDashboard();
        if (activeTab === 'properties') return renderProperties();
        if (activeTab === 'projects') return renderProjects();
        if (activeTab === 'inquiries') return renderInquiries();
        if (activeTab === 'interiorQueries') return renderInteriorQueries();
        if (activeTab === 'jobPostings') return renderJobPostings();
        if (activeTab === 'candidateApplications') return renderCandidateApplications();
        if (activeTab === 'settings') return renderSettings();
        if (activeTab === 'gallery') return <GalleryManagement />;
        if (activeTab === 'team') return renderTeamMembers();
        return (
            <div style={mainCardStyle}>
                <h2 style={cardHeaderStyle}>{activeTab.toUpperCase()} SECTION</h2>
                <div style={{ padding: '50px', textAlign: 'center', color: '#90A4AE' }}>Functional implementation in progress for {activeTab}.</div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FB', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #E6E9EF', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
               
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="md-hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607D8B' }}
                    >
                        <HiMenu size={24} />
                    </button>
                   <Link to="/"> <span style={{ fontWeight: '800', color: 'var(--color-navy)', fontSize: '18px', letterSpacing: '-0.5px' }}>THE REALTY XPERTS</span></Link>
                    <span className="lg-visible" style={{ color: '#90A4AE', fontSize: '13px', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #EEE' }}>Admin Portal</span>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                    <HiLogout /> <span className="lg-visible">Logout</span>
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                {/* Sidebar Backdrop for Mobile */}
                {windowWidth < 1024 && isSidebarOpen && (
                    <div 
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 850, backdropFilter: 'blur(2px)' }} 
                    />
                )}

                {/* Responsive Sidebar Overlay for Mobile */}
                <aside 
                    className={`${isSidebarOpen ? 'sidebar-active' : 'sidebar-hidden'}`}
                    style={{ 
                        width: '260px', 
                        backgroundColor: 'white', 
                        height: 'calc(100vh - 70px)', 
                        position: windowWidth < 1024 ? 'fixed' : 'sticky', 
                        top: '70px', 
                        left: 0, 
                        zIndex: 900, 
                        padding: '25px 15px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '5px', 
                        boxShadow: '4px 0 12px rgba(0,0,0,0.03)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRight: '1px solid #E6E9EF'
                    }}
                >
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', border: 'none', borderRadius: '12px',
                                backgroundColor: activeTab === item.id ? '#FFF8E1' : 'transparent',
                                color: activeTab === item.id ? 'var(--color-gold)' : '#666',
                                fontWeight: activeTab === item.id ? '700' : '500', 
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '14px'
                            }}
                        >
                            <item.icon size={18} style={{ color: activeTab === item.id ? 'var(--color-gold)' : '#90A4AE' }} />
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="main-content" style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
                    {renderContent()}
                </main>
            </div>

            {/* In-File CSS for responsiveness */}
            <style>{`
                .main-content {
                    padding: 40px;
                    transition: padding 0.3s;
                }

                @media (max-width: 1023px) {
                    .lg-visible { display: none !important; }
                    .sidebar-active { transform: translateX(0); }
                    .sidebar-hidden { transform: translateX(-100%); }
                    .main-content { padding: 20px; }
                }

                @media (min-width: 1024px) {
                    .md-hidden { display: none !important; }
                }

                @media (max-width: 768px) {
                    .main-content { padding: 15px; }
                    .stat-grid { grid-template-columns: 1fr !important; }
                    .recent-grid { grid-template-columns: 1fr !important; }
                    .form-grid { grid-template-columns: 1fr !important; }
                    .modal-content { padding: 25px !important; }
                    .type-grid { grid-template-columns: 1fr 1fr !important; }
                    .modal-inner { width: 95% !important; margin: 10px !important; }
                    .detail-grid { grid-template-columns: 1fr !important; gap: 15px !important; }
                    .mobile-hide { display: none !important; }
                }

                @media (max-width: 480px) {
                    .type-grid { grid-template-columns: 1fr !important; }
                    .header-logo { font-size: 14px !important; }
                    .premium-stat-value { font-size: 28px !important; }
                    .modal-content { padding: 20px !important; }
                    .modal-title { font-size: 20px !important; }
                    .stat-grid { gap: 15px !important; }
                    .card-content { padding: 15px !important; }
                }

                /* Table Responsiveness */
                .table-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    margin-bottom: 1rem;
                    width: 100%;
                }
                
                /* Custom Scrollbar for better look */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                ::-webkit-scrollbar-thumb {
                    background: #ccc;
                    borderRadius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }
            `}</style>

            {renderPropertyDetailModal()}
            {renderInvestmentDetailModal()}
            {renderProjectDetailModal()}
            {renderInquiryModal()}
            {renderSubmissionModal()}
            {renderInteriorQueryModal()}
            {renderApplicationModal()}
        </div>
    );

    function renderPropertyDetailModal() {
        if (!selectedProperty) return null;
        const p = selectedProperty;
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <button onClick={() => setSelectedProperty(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiX size={18} /></button>
                    <div className="modal-content" style={{ padding: '40px' }}>
                        <h3 className="modal-title" style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '20px' }}>{p.propertyName}</h3>
                        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Price</p><p style={detailValueStyle}>₹{p.price?.toLocaleString()}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Area</p><p style={detailValueStyle}>{p.area} Sq.ft</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Location</p><p style={detailValueStyle}>{p.location}, {p.city}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Status</p><p style={{...detailValueStyle, textTransform: 'capitalize'}}>{p.status}</p></div>
                        </div>
                        {p.images?.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {p.images.map((img, idx) => <img key={idx} src={img} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />)}
                            </div>
                        )}
                        <div style={{ background: '#F8F9FA', padding: '25px', borderRadius: '20px', marginBottom: '30px' }}>
                            <p style={detailLabelStyle}>Description</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{p.propertyDescription}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => { setEditProperty(p); setSelectedProperty(null); }}
                                style={{ flex: 1, backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiPencilAlt size={18} /> Edit Property
                            </button>
                            <a 
                                href={`/property/${p._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiEye size={18} /> View on Site
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderInvestmentDetailModal() {
        if (!selectedInvestment) return null;
        const i = selectedInvestment;
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <button onClick={() => setSelectedInvestment(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiX size={18} /></button>
                    <div className="modal-content" style={{ padding: '40px' }}>
                        <h3 className="modal-title" style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '20px' }}>{i.title}</h3>
                        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Total Price</p><p style={detailValueStyle}>₹{i.totalPrice?.toLocaleString()}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Area</p><p style={detailValueStyle}>{i.area} {i.areaUnit}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Land Type</p><p style={{...detailValueStyle, textTransform: 'capitalize'}}>{i.landType}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Location</p><p style={detailValueStyle}>{i.location}, {i.city}</p></div>
                        </div>
                        {i.images?.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {i.images.map((img, idx) => <img key={idx} src={img} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />)}
                            </div>
                        )}
                        <div style={{ background: '#F8F9FA', padding: '25px', borderRadius: '20px', marginBottom: '30px' }}>
                            <p style={detailLabelStyle}>Description</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{i.description}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => { setEditInvestment(i); setSelectedInvestment(null); }}
                                style={{ flex: 1, backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiPencilAlt size={18} /> Edit Investment
                            </button>
                            <a 
                                href={`/investment/${i._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiEye size={18} /> View on Site
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderProjectDetailModal() {
        if (!selectedProject) return null;
        const p = selectedProject;
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 22, 47, 0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className="modal-inner" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <button onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F8F9FA', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiX size={18} /></button>
                    <div className="modal-content" style={{ padding: '40px' }}>
                        <h3 className="modal-title" style={{ fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '20px' }}>{p.title}</h3>
                        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Price Starting</p><p style={detailValueStyle}>{p.price}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Type</p><p style={{...detailValueStyle, textTransform: 'capitalize'}}>{p.type}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Status</p><p style={{...detailValueStyle, textTransform: 'capitalize'}}>{p.status?.replace(/-/g, ' ')}</p></div>
                            <div style={detailBoxStyle}><p style={detailLabelStyle}>Location</p><p style={detailValueStyle}>{p.location}, {p.city}</p></div>
                        </div>
                        {p.images?.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {p.images.map((img, idx) => <img key={idx} src={img} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />)}
                            </div>
                        )}
                        <div style={{ background: '#F8F9FA', padding: '25px', borderRadius: '20px', marginBottom: '30px' }}>
                            <p style={detailLabelStyle}>Description</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{p.description}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => { setEditProject(p); setSelectedProject(null); }}
                                style={{ flex: 1, backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiPencilAlt size={18} /> Edit Project
                            </button>
                            <a 
                                href={`/project/${p._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ flex: 1, backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <HiEye size={18} /> View on Site
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};



// Premium Styles
const premiumStatCard = (gradient, textColor) => ({
    background: gradient,
    borderRadius: '20px',
    padding: '30px',
    display: 'flex',
    alignItems: 'flex-start',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    color: textColor,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease'
});

const premiumStatTitle = { fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9, marginBottom: '10px' };
const premiumStatValue = { fontSize: '38px', fontWeight: '900', lineHeight: 1, margin: 0 };
const premiumStatIconBox = (bg) => ({ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' });

const typeBreakdownBox = (bg, accent) => ({
    backgroundColor: bg,
    padding: '20px',
    borderRadius: '16px',
    border: `1px solid ${accent}22`,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
});

const typeLabelStyle = { fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase' };
const typeValueStyle = { fontSize: '24px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 };
const progressBarContainer = { width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', marginTop: '5px' };
const progressBar = (color, width) => ({ height: '100%', width: `${width}%`, backgroundColor: color, borderRadius: '3px', transition: 'width 1s ease-in-out' });

const recentItemRowStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px', 
    padding: '12px', 
    borderRadius: '12px', 
    transition: 'background 0.2s',
    '&:hover': { background: '#F8F9FB' } 
};

const recentItemImageStyle = { width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#F0F4F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const recentItemAvatarStyle = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#ECEFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#90A4AE', flexShrink: 0 };
const recentItemTitleStyle = { fontWeight: '700', fontSize: '14px', color: 'var(--color-navy)', margin: 0 };
const recentItemSubTitleStyle = { fontSize: '12px', color: '#666', margin: '2px 0 0' };
const recentItemPriceStyle = { fontWeight: '800', fontSize: '14px', color: 'var(--color-gold)', margin: 0 };
const recentItemStatusStyle = (status) => ({
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: status === 'available' ? '#27ae60' : '#e74c3c',
    display: 'block',
    marginTop: '2px'
});

const inquiryBadgeStyle = (status) => ({
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    backgroundColor: status === 'unread' ? '#FFEBEE' : status === 'responded' ? '#E8F5E9' : '#E3F2FD',
    color: status === 'unread' ? '#F44336' : status === 'responded' ? '#4CAF50' : '#2196F3'
});

const statusBadgeStyle = (status) => {
    const map = {
        new: { bg: '#FFEBEE', color: '#F44336' },
        contacted: { bg: '#E3F2FD', color: '#2196F3' },
        converted: { bg: '#E8F5E9', color: '#4CAF50' },
        rejected: { bg: '#FFF3E0', color: '#FF9800' },
        applied: { bg: '#FFEBEE', color: '#F44336' },
        reviewed: { bg: '#E3F2FD', color: '#2196F3' },
        shortlisted: { bg: '#E8F5E9', color: '#4CAF50' },
        hired: { bg: '#F3E5F5', color: '#9C27B0' },
        unread: { bg: '#FFEBEE', color: '#F44336' },
        responded: { bg: '#E8F5E9', color: '#4CAF50' },
        read: { bg: '#E3F2FD', color: '#2196F3' },
    };
    const s = map[status] || { bg: '#ECEFF1', color: '#607D8B' };
    return {
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '800',
        textTransform: 'uppercase',
        backgroundColor: s.bg,
        color: s.color,
    };
};

const mainCardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' };
const cardHeaderStyle = { color: 'var(--color-navy)', fontSize: '16px', fontWeight: '700', marginBottom: '20px' };
const actionButtonStyle = { width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: '15px' };

const tableHeaderStyle = { textAlign: 'left', padding: '12px 15px', fontSize: '10px', color: '#90A4AE', fontWeight: '800', letterSpacing: '1px' };
const tableCellStyle = { padding: '15px', fontSize: '13px', color: '#455A64' };

const detailBoxStyle = { background: '#F8F9FA', padding: '15px', borderRadius: '12px' };
const detailLabelStyle = { fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' };
const detailValueStyle = { margin: 0, fontWeight: '700', color: 'var(--color-navy)' };

const inputFieldStyle = {
    padding: '12px 15px',
    backgroundColor: '#F8F9FA',
    border: '1px solid #E6E9EF',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#455A64',
    outline: 'none',
    width: '100%'
};

export default AdminDashboard;
