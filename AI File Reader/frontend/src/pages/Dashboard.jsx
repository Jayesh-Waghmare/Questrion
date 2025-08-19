import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState({});

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const ts = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
    const date = new Date(ts);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  const getDashboardData = async () => {
    try {
      const token = await getToken({ template: 'default' });
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations || []);
      } else {
        toast.error(data.message || 'Failed to load creations');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching creations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const normalize = (s) => (s || '').toString().toLowerCase();
  const filteredCreations = useMemo(() => {
    const q = normalize(search);
    if (!q) return creations;
    return (creations || []).filter((c) => {
      const haystack = [
        c.pdf_filename,
        c.prompt,
        c.content,
        c.type,
        c.id,
      ]
        .map((f) => normalize(f))
        .join(' \n ');
      return haystack.includes(q);
    });
  }, [creations, search]);

  const handleDelete = async (creationId) => {
    setDeleting((prev) => ({ ...prev, [creationId]: true }));
    try {
      const token = await getToken({ template: 'default' });
      const { data } = await axios.delete(`/api/user/delete-creation/${creationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success('Deleted successfully');
        setCreations((prev) => prev.filter((c) => c.id !== creationId));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || 'Failed to delete');
    } finally {
      setDeleting((prev) => {
        const copy = { ...prev };
        delete copy[creationId];
        return copy;
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 text-white">
      {/* Header */}
      <div className="flex justify-start gap-4 flex-wrap items-center">

        {/* Search Bar */}
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your chats..."
            className="w-150 sm:w-80 p-2 px-3 rounded-lg input-dark text-sm outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <span className="w-11 h-11 rounded-full border-3 border-white border-t-transparent animate-spin"></span>
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          <p className="mb-4 text-lg font-semibold">Recent Chats</p>

          {creations.length === 0 && <p>No creations found.</p>}

          {filteredCreations.length === 0 && creations.length > 0 && (
            <p>No results for "{search}"</p>
          )}

          {filteredCreations.map((creation) => (
            <div
              key={creation.id}
              className="creation-item p-4 mb-4 rounded-2xl glass glass-hover"
            >
              <h3 className="font-medium text-lg">
                {creation.pdf_filename || creation.prompt || 'Document Upload'}
              </h3>
              <p className="text-white/80">
                {creation.content
                  ? creation.content.substring(0, 200) +
                    (creation.content.length > 200 ? '...' : '')
                  : ''}
              </p>

              <details className="mt-3 cursor-pointer">
                <summary className="w-full text-indigo-300 ">
                  Show Chat History ({creation.chat_messages?.length || 0})
                </summary>

                <div className="chat-history mt-2 max-h-64 overflow-y-auto">
                  {!creation.chat_messages || creation.chat_messages.length === 0 ? (
                    <p>No chat messages</p>
                  ) : (
                    creation.chat_messages.map((chat, idx) => (
                      <div
                        key={idx}
                        className="chat-message p-1 rounded glass"
                      >
                        {/* User message */}
                        <div className="text-right p-2">
                          <div className="inline-block bg-emerald-500 text-white rounded-full p-2 max-w-[75%] break-words">
                            <Markdown>{chat.message}</Markdown>
                          </div>
                          <div className="text-xs mt-1 opacity-70">
                            {formatTime(chat.created_at)}
                          </div>
                        </div>

                        {/* Assistant response */}
                        {chat.response && (
                          <div className="text-left p-2 mt-2">
                            <div className="inline-block bg-white/10 text-white rounded-xl p-2 max-w-[75%] break-words border border-white/20">
                              <Markdown>{chat.response}</Markdown>
                            </div>
                            <div className="text-xs mt-1 opacity-70">
                              {formatTime(chat.created_at)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                  <button
                    className="mt-4 px-4 py-2 btn-accent1 text-white cursor-pointer rounded-full"
                    onClick={() => navigate(`/ai/pdf?conversationId=${creation.id}`)}
                  >
                    Continue chatting
                  </button>
                <button
                  className="mt-4 ml-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleDelete(creation.id)}
                  disabled={!!deleting[creation.id]}
                >
                  {deleting[creation.id] ? 'Deleting...' : 'Delete'}
                </button>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;