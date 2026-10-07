import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';

type Wish = {
  id: number;
  name: string;
  message: string;
  created_at: string;
  participant_name?: string;
};

type Participant = {
  id: number;
  name: string;
  hash: string;
  attending: boolean | null;
  party: 'Anudi' | 'Ishara' | 'Uncategorised';
  created_at: string;
};

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'rsvps' ? 'rsvps' : 'wishes';
  const [activeTab, setActiveTab] = useState<'wishes' | 'rsvps'>(initialTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Wishes state
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteWishId, setDeleteWishId] = useState<number | null>(null);
  const limit = 10;
  
  // Participants state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantParty, setNewParticipantParty] = useState<'Anudi' | 'Ishara' | 'Uncategorised'>('Uncategorised');
  const [rsvpError, setRsvpError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [deleteParticipantId, setDeleteParticipantId] = useState<number | null>(null);
  const [heartsCount, setHeartsCount] = useState(0);
  const [animatedHeartsCount, setAnimatedHeartsCount] = useState(0);
  
  type AdminFloatingHeart = {
    id: number;
    x: string | number;
    y: number;
    scale: number;
    rotation: number;
    color: string;
    duration: number;
  };
  const [adminHearts, setAdminHearts] = useState<AdminFloatingHeart[]>([]);
  const adminHeartIdCounter = useRef(0);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };
  
  const [editParticipant, setEditParticipant] = useState<Participant | null>(null);
  
  const [partyFilter, setPartyFilter] = useState<'Anudi' | 'Ishara' | 'Uncategorised'>('Anudi');
  
  const observerTarget = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && wishes.length < total && !isLoading) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [wishes.length, total, isLoading]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishes = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/wishes?page=${page}&limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (page === 1) {
            setWishes(data.data);
          } else {
            setWishes(prev => {
              const newWishes = [...prev];
              data.data.forEach((w: Wish) => {
                if (!newWishes.some(existing => existing.id === w.id)) {
                  newWishes.push(w);
                }
              });
              return newWishes;
            });
          }
          setTotal(data.total);
        } else {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'wishes') {
      fetchWishes();
    }
  }, [navigate, page, activeTab]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/participants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setParticipants(data);
        }
      } catch (err) {
        setRsvpError('Failed to fetch participants.');
      }
    };

    if (activeTab === 'rsvps') {
      fetchParticipants();
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch hearts on load
    fetch(`${API_URL}/hearts`)
      .then(res => res.json())
      .then(data => {
        setHeartsCount(data.count);
        const lastSeen = parseInt(localStorage.getItem('lastSeenHearts') || '0');
        if (data.count > lastSeen) {
          triggerHeartExplosion();
          localStorage.setItem('lastSeenHearts', data.count.toString());
        }
      })
      .catch(console.error);
  }, []);

  // Number counter animation effect
  useEffect(() => {
    if (heartsCount === 0) return;
    
    let startTimestamp: number | null = null;
    const duration = 2500; // 2.5 seconds
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart for a very smooth, dramatic slow down at the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedHeartsCount(Math.floor(heartsCount * easeProgress));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setAnimatedHeartsCount(heartsCount);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [heartsCount]);

  const triggerHeartExplosion = () => {
    const newHearts: AdminFloatingHeart[] = [];
    const colors = ['#ef4444', '#ec4899', '#f43f5e', '#e8d5b5', '#fbbf24', '#a855f7'];
    
    // Spawn 80 hearts dynamically across the screen
    for (let i = 0; i < 80; i++) {
      newHearts.push({
        id: adminHeartIdCounter.current++,
        x: (Math.random() * 120) - 10 + '%', // Random horizontal starting point (can go slightly offscreen)
        y: window.innerHeight + (Math.random() * 400), // Staggered start below screen
        scale: 0.5 + Math.random() * 2.5, // Much wider variety of sizes
        rotation: Math.random() * 360 - 180, // Full rotation randomness
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 2 + Math.random() * 4, // Random animation duration 2s to 6s
      });
    }
    
    setAdminHearts(prev => [...prev, ...newHearts]);
    
    // Remove only this batch of hearts after the longest animation finishes
    setTimeout(() => {
      setAdminHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 7000);
  };

  const confirmDelete = (id: number) => {
    setOpenDropdown(null);
    setDeleteWishId(id);
  };

  const executeDelete = async () => {
    if (deleteWishId === null) return;
    
    const id = deleteWishId;
    setDeleteWishId(null);
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/wishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setWishes(wishes.filter(wish => wish.id !== id));
        setTotal(total - 1);
        showToast('Wish deleted successfully!');
      } else {
        setError('Failed to delete wish.');
        showToast('Failed to delete wish.');
      }
    } catch (err) {
      setError('Error communicating with server.');
      showToast('Error communicating with server.');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newParticipantName, party: newParticipantParty })
      });
      
      if (res.ok) {
        setNewParticipantName('');
        setNewParticipantParty('Uncategorised');
        // Refresh list
        const resList = await fetch(`${API_URL}/participants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resList.ok) {
          const data = await resList.json();
          setParticipants(data);
          showToast('Participant created successfully!');
        }
      } else {
        setRsvpError('Failed to add participant');
        showToast('Failed to add participant.');
      }
    } catch (err) {
      setRsvpError('Error communicating with server.');
      showToast('Error communicating with server.');
    }
  };

  const confirmDeleteParticipant = (id: number) => {
    setOpenDropdown(null);
    setDeleteParticipantId(id);
  };

  const executeDeleteParticipant = async () => {
    if (deleteParticipantId === null) return;
    const id = deleteParticipantId;
    setDeleteParticipantId(null);
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/participants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setParticipants(participants.filter(p => p.id !== id));
        showToast('Participant deleted successfully!');
      } else {
        setRsvpError('Failed to delete participant.');
        showToast('Failed to delete participant.');
      }
    } catch (err) {
      setRsvpError('Error communicating with server.');
      showToast('Error communicating with server.');
    }
  };

  const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editParticipant || !editParticipant.name.trim()) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/participants/${editParticipant.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editParticipant.name, party: editParticipant.party })
      });
      
      if (res.ok) {
        setEditParticipant(null);
        // Refresh list
        const resList = await fetch(`${API_URL}/participants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resList.ok) {
          const data = await resList.json();
          setParticipants(data);
          showToast('Participant updated successfully!');
        }
      } else {
        setRsvpError('Failed to update participant');
        showToast('Failed to update participant.');
      }
    } catch (err) {
      setRsvpError('Error communicating with server.');
      showToast('Error communicating with server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 rounded bg-rose/20"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-rose/20"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-full max-w-[200px] rounded bg-rose/20"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-rose/20"></div></td>
      <td className="px-6 py-4 text-center"><div className="mx-auto h-8 w-8 rounded-full bg-rose/20"></div></td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-cream px-3 py-6 sm:p-8 text-rose" onClick={() => setOpenDropdown(null)}>
      {/* Delete Confirmation Modal */}
      {deleteWishId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-cream border border-rose/20 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-xl font-bold text-rose">Delete Wish?</h3>
            <p className="mb-6 text-sm text-rose/80">
              Are you absolutely sure you want to permanently delete this wish? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteWishId(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-rose/70 hover:bg-rose/10"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="rounded-xl bg-red-900/80 px-4 py-2 text-sm font-semibold text-rose hover:bg-red-800 shadow-sm border border-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Participant Confirmation Modal */}
      {deleteParticipantId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-cream border border-rose/20 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-xl font-bold text-rose">Delete Participant?</h3>
            <p className="mb-6 text-sm text-rose/80">
              Are you absolutely sure you want to permanently delete this participant? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteParticipantId(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-rose/70 hover:bg-rose/10"
              >
                Cancel
              </button>
              <button 
                onClick={executeDeleteParticipant}
                className="rounded-xl bg-red-900/80 px-4 py-2 text-sm font-semibold text-rose hover:bg-red-800 shadow-sm border border-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {editParticipant !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleUpdateParticipant}
            className="w-full max-w-sm rounded-2xl bg-cream border border-rose/20 p-6 shadow-xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-xl font-bold text-rose">Edit Participant</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-rose/80 mb-1">Name</label>
              <input
                type="text"
                value={editParticipant.name}
                onChange={e => setEditParticipant({...editParticipant, name: e.target.value})}
                className="w-full rounded-xl border border-rose/30 bg-black/20 px-3 py-2 text-rose focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-rose/80 mb-1">Party</label>
              <select
                value={editParticipant.party}
                onChange={e => setEditParticipant({...editParticipant, party: e.target.value as any})}
                className="w-full rounded-xl border border-rose/30 bg-black/20 px-3 py-2 text-rose focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose"
              >
                <option value="Anudi" className="bg-[#183a2a] text-[#e8d5b5]">Anudi</option>
                <option value="Ishara" className="bg-[#183a2a] text-[#e8d5b5]">Ishara</option>
                <option value="Uncategorised" className="bg-[#183a2a] text-[#e8d5b5]">Uncategorised</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                type="button"
                onClick={() => setEditParticipant(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-rose/70 hover:bg-rose/10"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-cream hover:bg-rose/90 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        {/* Heart Counter Banner */}
        <div 
          onClick={triggerHeartExplosion}
          className="mb-8 relative overflow-hidden cursor-pointer select-none group rounded-xl border border-rose/20 bg-black/20 px-6 py-4 shadow-xl backdrop-blur-xl transition-all hover:scale-[1.01] hover:border-rose/40 hover:bg-black/30 active:scale-[0.99] flex items-center justify-between"
        >
          {/* Subtle animated background glow */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-red-500/10 blur-[40px] transition-opacity group-hover:bg-red-500/20"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-2xl animate-pulse drop-shadow-md">❤️</span>
            <p className="text-lg sm:text-xl font-medium text-rose">
              Wow! You got <strong className="text-xl sm:text-2xl font-bold bg-rose/10 px-2 py-0.5 rounded-md mx-1">{animatedHeartsCount.toLocaleString()}</strong> hearts!
            </p>
          </div>
          
          <div className="hidden sm:block text-rose/50 group-hover:text-rose/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl sm:text-4xl">Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="rounded bg-rose/20 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-rose hover:bg-rose/30"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-3 sm:gap-4 border-b border-rose/20 pb-4">
          <button 
            onClick={() => setActiveTab('wishes')}
            className={`text-base sm:text-lg font-medium transition ${activeTab === 'wishes' ? 'text-rose border-b-2 border-rose' : 'text-rose/50 hover:text-rose'}`}
          >
            Wishes
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            className={`text-base sm:text-lg font-medium transition ${activeTab === 'rsvps' ? 'text-rose border-b-2 border-rose' : 'text-rose/50 hover:text-rose'}`}
          >
            Attendance
          </button>
        </div>
        
        {activeTab === 'wishes' ? (
          <>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            
            <div className="mb-4 text-sm font-medium text-rose/70">
              Total wishes: <span className="font-bold text-rose">{total}</span>
            </div>
            
            <div className="overflow-visible rounded-xl border border-rose/10 bg-black/20 shadow-lg backdrop-blur-md mb-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/30 uppercase tracking-wider text-rose/70">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Message</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose/5">
                    {wishes.length === 0 && !isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-rose/50">
                          No wishes found.
                        </td>
                      </tr>
                    ) : (
                      wishes.map((wish) => (
                        <tr key={wish.id} className="hover:bg-black/40 transition-colors">
                          <td className="px-6 py-4">{wish.id}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold block">{wish.name}</span>
                            {wish.participant_name && (
                              <span className="text-xs text-rose/60">({wish.participant_name})</span>
                            )}
                          </td>
                          <td className="px-6 py-4 break-words whitespace-pre-wrap max-w-[300px]">{wish.message}</td>
                          <td className="px-6 py-4 text-xs">
                            {new Date(wish.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === wish.id ? null : wish.id);
                              }}
                              className="rounded-full p-2 hover:bg-rose/10 focus:outline-none"
                            >
                              <svg className="w-5 h-5 text-rose/70" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {openDropdown === wish.id && (
                              <div className="absolute right-6 top-10 z-50 w-32 rounded-lg border border-rose/20 bg-white py-1 shadow-lg">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(wish.id);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                    {isLoading && wishes.length === 0 && (
                      <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block md:hidden divide-y divide-rose/5 bg-black/20">
                {wishes.length === 0 && !isLoading ? (
                  <div className="p-8 text-center text-rose/50 font-medium">No wishes found.</div>
                ) : (
                  wishes.map((wish) => (
                    <div key={wish.id} className="group relative p-4 sm:p-5 transition duration-300 hover:bg-black/40">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col flex-1 min-w-0 pr-4">
                          <h3 className="font-serif text-lg font-bold text-rose break-words leading-tight">
                            {wish.name}
                            {wish.participant_name && <span className="ml-2 inline-flex items-center rounded-full bg-rose/10 px-2 py-0.5 text-[10px] font-bold text-rose/80 uppercase tracking-wider">Real: {wish.participant_name}</span>}
                          </h3>
                          <p className="text-[11px] font-medium tracking-wider text-rose/50 mt-1.5 uppercase">{new Date(wish.created_at).toLocaleString()}</p>
                        </div>
                        <div className="relative flex-shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === wish.id ? null : wish.id);
                            }}
                            className="rounded-full p-2 text-rose/50 hover:bg-rose/10 hover:text-rose transition focus:outline-none"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          
                          {openDropdown === wish.id && (
                            <div className="absolute right-0 top-10 z-50 w-32 rounded-xl border border-rose/10 bg-white py-1.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(wish.id);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative mt-4 rounded-2xl bg-black/30 p-4 shadow-inner border border-rose/10 backdrop-blur-sm">
                        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed text-rose/90 font-medium">
                          {wish.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && wishes.length === 0 && (
                  <div className="p-6 space-y-5">
                    <div className="animate-pulse h-5 w-32 bg-rose/15 rounded-md"></div>
                    <div className="animate-pulse h-24 w-full bg-rose/10 rounded-2xl"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Load More Button */}
            {wishes.length < total && (
              <div ref={observerTarget} className="flex justify-center mt-6 mb-12">
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={isLoading}
                  className="rounded-full bg-rose px-8 py-3 text-sm font-bold tracking-widest text-cream shadow-md transition hover:bg-rose/90 hover:shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'LOADING...' : 'LOAD MORE'}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Participants View */}
            <form onSubmit={handleAddParticipant} className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
              <input
                type="text"
                value={newParticipantName}
                onChange={e => setNewParticipantName(e.target.value)}
                placeholder="Participant Name"
                className="w-full sm:flex-1 h-[52px] rounded-xl border border-rose/30 bg-black/20 px-4 placeholder:text-rose/40 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose"
                required
              />
              <select
                value={newParticipantParty}
                onChange={e => setNewParticipantParty(e.target.value as any)}
                className="w-full sm:w-auto h-[52px] rounded-xl border border-rose/30 bg-black/20 px-4 text-rose/80 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23e8d5b5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
              >
                <option value="Uncategorised" className="bg-[#183a2a] text-[#e8d5b5]">Select Party</option>
                <option value="Anudi" className="bg-[#183a2a] text-[#e8d5b5]">Anudi</option>
                <option value="Ishara" className="bg-[#183a2a] text-[#e8d5b5]">Ishara</option>
                <option value="Uncategorised" className="bg-[#183a2a] text-[#e8d5b5]">Uncategorised</option>
              </select>
              <button 
                type="submit"
                className="w-full sm:w-auto h-[52px] rounded-xl bg-rose px-6 font-semibold text-cream shadow-md hover:bg-rose/90 transition flex items-center justify-center"
              >
                Create Invite Link
              </button>
            </form>

            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3 border-b border-rose/10 pb-3">
              <button 
                onClick={() => setPartyFilter('Anudi')}
                className={`px-3 py-1 text-sm sm:text-base font-semibold transition ${partyFilter === 'Anudi' ? 'text-rose border-b-2 border-rose' : 'text-rose/40 hover:text-rose/80'}`}
              >
                Anudi
              </button>
              <button 
                onClick={() => setPartyFilter('Ishara')}
                className={`px-3 py-1 text-sm sm:text-base font-semibold transition ${partyFilter === 'Ishara' ? 'text-rose border-b-2 border-rose' : 'text-rose/40 hover:text-rose/80'}`}
              >
                Ishara
              </button>
              <button 
                onClick={() => setPartyFilter('Uncategorised')}
                className={`px-3 py-1 text-sm sm:text-base font-semibold transition ${partyFilter === 'Uncategorised' ? 'text-rose border-b-2 border-rose' : 'text-rose/40 hover:text-rose/80'}`}
              >
                Uncategorised
              </button>
            </div>

            {rsvpError && <p className="mb-4 text-red-500 text-sm">{rsvpError}</p>}
            
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-rose/70">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500"></span>
                <span>Coming: <strong className="text-rose">{participants.filter(p => p.party === partyFilter && p.attending === true).length}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500"></span>
                <span>Not coming: <strong className="text-rose">{participants.filter(p => p.party === partyFilter && p.attending === false).length}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-yellow-500"></span>
                <span>Pending: <strong className="text-rose">{participants.filter(p => p.party === partyFilter && p.attending === null).length}</strong></span>
              </div>
            </div>

            <div className="overflow-visible rounded-xl border border-rose/10 bg-black/20 shadow-lg backdrop-blur-md mb-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/30 uppercase tracking-wider text-rose/70">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Invite Link</th>
                      <th className="px-6 py-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose/5">
                    {participants.filter(p => p.party === partyFilter).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-rose/50">
                          No participants found in this party.
                        </td>
                      </tr>
                    ) : (
                      participants.filter(p => p.party === partyFilter).map((p) => (
                        <tr key={p.id} className="hover:bg-black/40 transition-colors">
                          <td className="px-6 py-4 font-bold">{p.name}</td>
                          <td className="px-6 py-4">
                            {p.attending === true && <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Attending</span>}
                            {p.attending === false && <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">Declined</span>}
                            {p.attending === null && <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">Pending</span>}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/${p.hash}`;
                                navigator.clipboard.writeText(link);
                                showToast('Link copied to clipboard!');
                              }}
                              className="text-rose underline hover:text-rose/70"
                            >
                              Copy Link
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === p.id ? null : p.id);
                              }}
                              className="rounded-full p-2 hover:bg-rose/10 focus:outline-none"
                            >
                              <svg className="w-5 h-5 text-rose/70" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {openDropdown === p.id && (
                              <div className="absolute right-6 top-10 z-50 w-32 rounded-lg border border-rose/20 bg-white py-1 shadow-lg">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditParticipant(p);
                                    setOpenDropdown(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteParticipant(p.id);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block md:hidden divide-y divide-rose/5 bg-black/20">
                {participants.filter(p => p.party === partyFilter).length === 0 ? (
                  <div className="p-8 text-center text-rose/50 font-medium">No participants found in this party.</div>
                ) : (
                  participants.filter(p => p.party === partyFilter).map((p) => (
                    <div key={p.id} className="group relative p-4 sm:p-5 transition duration-300 hover:bg-black/40">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
                          <h3 className="font-serif text-lg font-bold text-rose truncate">{p.name}</h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {p.attending === true && <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>Attending</span>}
                            {p.attending === false && <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Declined</span>}
                            {p.attending === null && <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Pending</span>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === p.id ? null : p.id);
                              }}
                              className="rounded-full p-2 text-rose/50 hover:bg-rose/10 hover:text-rose transition focus:outline-none -mr-2"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {openDropdown === p.id && (
                              <div className="absolute right-0 top-10 z-50 w-32 rounded-xl border border-rose/10 bg-white py-1.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditParticipant(p);
                                    setOpenDropdown(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteParticipant(p.id);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/${p.hash}`;
                              navigator.clipboard.writeText(link);
                              showToast('Link copied to clipboard!');
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-rose/10 px-3 py-1.5 text-xs font-bold text-rose shadow-sm transition hover:bg-rose/20 active:scale-95 mt-1"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}

      {/* Admin Floating Hearts */}
      {adminHearts.map(h => (
        <div 
          key={h.id}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: h.x,
            top: h.y,
            transform: `scale(${h.scale}) rotate(${h.rotation}deg)`,
            color: h.color,
            animation: `float-up-explosion ${h.duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards` 
          }}
        >
          <svg className="w-10 h-10 drop-shadow-xl opacity-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
