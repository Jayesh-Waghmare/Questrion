import React, { useEffect, useState, useRef } from 'react';
import { FileText, Sparkles, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

const Pdf = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { getToken } = useAuth();
  const location = useLocation();

  const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestionsLoading, setSuggestionsLoading] = useState(false);

	const normalizeText = (s) =>
		(s || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

	const fetchSuggestions = async () => {
		if (!conversationId) return;
		try {
			setSuggestionsLoading(true);
			const token = await getToken({ template: 'default' });
			const { data } = await axios.get('/api/ai/suggestions', {
				params: { conversationId },
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success && Array.isArray(data.suggestions)) {
				const asked = new Set(
					(chatMessages || [])
						.filter((m) => m.type === 'user')
						.map((m) => normalizeText(m.content))
				);
				const unique = data.suggestions.filter((s) => !asked.has(normalizeText(s)));
				setSuggestions(unique);
			}
		} finally {
			setSuggestionsLoading(false);
		}
	};

  const handleSuggestionClick = async (text) => {
    setShowSuggestions(false);
    await askQuestion(text);
  };

  const getTimestampNoSeconds = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const ts = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
    const date = new Date(ts);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load conversation from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlConversationId = params.get('conversationId');

    if (urlConversationId) {
      loadConversationFromAPI(urlConversationId);
    }
  }, [location.search]);

  // Load conversation from backend
  const loadConversationFromAPI = async (convId) => {
    try {
      setLoading(true);
      const token = await getToken({ template: 'default' });
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message || 'Failed to load conversation');
        setLoading(false);
        return;
      }

      // Find the creation with the matching ID
      const creation = (data.creations || []).find((c) => String(c.id) === String(convId));

      if (!creation) {
        toast.error('Conversation not found');
        setLoading(false);
        return;
      }

      setPdfContent(creation.content || creation.prompt || '');
      setConversationId(creation.id);

      const combinedMessages = [];
      (creation.chat_messages || []).forEach((chat) => {
        const userTimestamp = chat.created_at ? chat.created_at.slice(0, 16) : getTimestampNoSeconds();
        combinedMessages.push({
          type: 'user',
          content: chat.message,
          timestamp: userTimestamp,
        });
        if (chat.response) {
          const assistantTimestamp = chat.created_at ? chat.created_at.slice(0, 16) : getTimestampNoSeconds();
          combinedMessages.push({
            type: 'assistant',
            content: chat.response,
            timestamp: assistantTimestamp,
          });
        }
      });

      // Sort messages by timestamp ascending
      combinedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setChatMessages(combinedMessages);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error('Please select a document to upload.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', input);
      const token = await getToken({ template: 'default' });
      const { data } = await axios.post('/api/ai/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) {
        setPdfContent(data.extractedText || data.pdfText || data.fileText || '');
        setConversationId(data.conversationId);
        setChatMessages([
          {
            type: 'system',
            content: 'Document uploaded successfully! You can now ask questions about it.',
            timestamp: getTimestampNoSeconds(),
          },
        ]);
        toast.success('Document uploaded and processed successfully!');
      } else {
        toast.error(data.message || 'Failed to process document.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (question) => {
    if (!question || !question.trim()) return;
    if (!conversationId) {
      toast.error('No active conversation. Please upload a PDF again.');
      return;
    }
    if (chatLoading) return;

    const userMessage = {
      type: 'user',
      content: question,
      timestamp: getTimestampNoSeconds(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    setSuggestions((prev) => prev.filter((s) => normalizeText(s) !== normalizeText(question)));

    try {
      const token = await getToken({ template: 'default' });
      const { data } = await axios.post(
        '/api/ai/chat',
        { message: question, conversationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const aiMessage = {
          type: 'assistant',
          content: data.content,
          timestamp: getTimestampNoSeconds(),
        };
        setChatMessages((prev) => [...prev, aiMessage]);
        setChatLoading(false);
        await fetchSuggestions();
      } else {
        if (data.message?.includes('Conversation not found')) {
          toast.error('Conversation expired. Please upload the PDF again.');
          clearConversation();
        } else {
          toast.error(data.message || 'Error from server');
        }
        setChatLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred'
      );
      setChatLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    await askQuestion(chatInput);
  };

  const clearConversation = () => {
    setPdfContent('');
    setConversationId(null);
    setChatMessages([]);
    setChatInput('');
    localStorage.removeItem('pdfConversation');
  };

  return (
    <div className="h-full overflow-y-scroll p-4 flex items-start flex-wrap gap-4 text-white">
      {/* Left Column - Upload */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 rounded-lg glass glass-hover">
        <div className="flex items-center gap-3 text-white">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Upload Document</h1>
        </div>
        <p className="mt-6 text-sm font-medium text-white">Upload a document</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.md"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md input-dark cursor-pointer"
          disabled={loading}
          required={!pdfContent}
        />
        <p className="text-xs text-gray-400 font-light mt-1">
          Supports PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx, .xls), Text (.txt, .md)
        </p>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-indigo-500 to-indigo-700  text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin" /> : <FileText className="w-5" />}
          Send Document
        </button>
        {pdfContent && (
          <button
            type="button"
            onClick={clearConversation}
            className="w-full mt-2 border border-red-500 text-red-500 hover:text-white px-4 py-2 text-sm rounded-lg hover:bg-red-500 cursor-pointer"
          >
            Clear Conversation
          </button>
        )}
      </form>

      {/* Right Column - Chat Interface */}
      <div className="w-full max-w-md p-4 rounded-lg flex flex-col glass glass-hover min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Chat with Document</h1>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center mt-5">
            <span className="w-11 h-11 rounded-full border-3 border-white border-t-transparent animate-spin"></span>
          </div>
        ) : !pdfContent ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
              <FileText className="w-9 h-9" />
              <p>Upload a document and click Send Document to get started.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto mt-3 space-y-3">
							{chatMessages.length === 0 && (
								<p className="text-center mt-10 text-gray-400">No chat messages yet.</p>
							)}
							{chatMessages.map((message, index) => (
								<div
									key={index}
									className={`flex ${
										message.type === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[80%] p-3 rounded-lg ${
											message.type === 'user'
                        ? 'bg-emerald-500 text-white'
                        : message.type === 'system'
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-white/10 text-white border border-white/20'
										}`}
									>
										<Markdown>{message.content}</Markdown>
										<div className="text-xs mt-1 opacity-70">
											{formatTime(message.timestamp)}
										</div>
									</div>
								</div>
							))}

							{chatLoading && (
								<div className="flex justify-start">
									<div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
											<span
												className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
												style={{ animationDelay: '0.1s' }}
											/>
											<span
												className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
												style={{ animationDelay: '0.2s' }}
											/>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

              {/* Suggestions (horizontal scroll above input) */}
              {pdfContent && showSuggestions && (
              <div className="shrink-0 overflow-x-auto overflow-y-hidden py-1">
								{suggestionsLoading && (
									<span className="text-xs text-gray-300 inline-block">Loading suggestions...</span>
								)}
								{!suggestionsLoading && suggestions.length > 0 && (
                    <div className="inline-flex gap-2 whitespace-nowrap">
										{suggestions.map((s, i) => (
											<button
												key={i}
												type="button"
												onMouseDown={(e) => e.preventDefault()}
												onClick={() => handleSuggestionClick(s)}
                        className="px-2 py-1 text-xs rounded-full chip cursor-pointer"
												title={s}
											>
												{s}
											</button>
										))}
									</div>
								)}
								{!suggestionsLoading && !suggestions.length && (
									<button
										type="button"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => fetchSuggestions()}
                    className="px-2 py-1 text-xs rounded-full chip inline-flex items-center gap-1 h-5"
									>
										<Sparkles className="w-3 h-3 cursor-pointer" /> Get suggestions
									</button>
								)}
							</div>
						)}

						{/* Chat Input */}
						<form onSubmit={handleChatSubmit} className="mt-3 flex items-center gap-2">
            <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question about the document..."
                className="flex-1 max-w-[90%] min-w-0 p-2 px-3 outline-none text-sm rounded-sm input-dark"
                disabled={chatLoading}
                onFocus={async () => {
                  setShowSuggestions(true);
                  await fetchSuggestions();
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <button
								type="submit"
								disabled={chatLoading || !chatInput.trim()}
                className="p-2 btn-accent1 text-white rounded-md disabled:opacity-50"
							>
								<Send className="w-4 h-4 cursor-pointer"/>
							</button>
          </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Pdf;