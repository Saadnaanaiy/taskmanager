import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://taskmanager-olxx.onrender.com/api/note', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotes(data.notes || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onEdit = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  const addOrEditNote = async (title, desc, tags, date) => {
    if (!title || !desc) {
      toast.error('Title and description are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://taskmanager-olxx.onrender.com/api/note/add',
        { title, desc, tags, date },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      if (response.data.success) {
        toast.success('Note added successfully!');
        closeModal();
        fetchNotes();
      }
    } catch (error) {
      toast.error('Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  const editNote = async (id, title, desc, date, tags) => {
    try {
      const response = await axios.put(
        `https://taskmanager-olxx.onrender.com/api/note/${id}`,
        { title, desc, tags, date },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      if (response.data.success) {
        toast.success('Note updated successfully!');
        closeModal();
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update note.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axios.delete(
        `https://taskmanager-olxx.onrender.com/api/note/${noteId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      if (response.data.success) {
        toast.success('Note deleted successfully!');
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete note.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar onSearch={setSearchQuery} />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Add new note"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isModalOpen && (
        <NoteModal
          editNote={editNote}
          open={isModalOpen}
          closeModal={closeModal}
          addNote={addOrEditNote}
          currentNote={currentNote}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="mt-16 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {notes.length === 0
                ? 'No Notes Available'
                : 'No Notes Matching Your Search'}
            </h2>
            <p className="text-gray-600">
              {notes.length === 0
                ? 'Click the + button to create your first note'
                : 'Try adjusting your search terms'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {note.title}
                  </h3>
                  <div className="flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(note)}
                      className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                      aria-label="Edit note"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="rounded-full p-2 text-red-600 hover:bg-red-50"
                      aria-label="Delete note"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <span className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  {new Date(note.date).toLocaleDateString()}
                </span>

                <p className="mb-4 text-gray-600">{note.desc}</p>

                {note.tags && note.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      Tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
