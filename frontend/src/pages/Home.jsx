import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import { message, Card, Spin, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

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
      const { data } = await axios.get('http://localhost:5001/api/note', {
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
        'http://localhost:5001/api/note/add',
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
        `http://localhost:5001/api/note/${id}`,
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
        `http://localhost:5001/api/note/${noteId}`,
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
      message.error('Failed to delete note.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onSearch={setSearchQuery} />

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 shadow-lg text-white fixed right-6 bottom-6 font-bold p-4 rounded-full z-50 flex items-center justify-center transition-all duration-300"
      >
        <PlusOutlined style={{ fontSize: 20 }} />
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

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center mt-10">
            <Title level={4}>
              {notes.length === 0
                ? 'No Notes Available'
                : 'No Notes Matching Your Search'}
            </Title>
            <Text type="secondary">
              {notes.length === 0
                ? 'Click the + button to create a new note.'
                : 'Try adjusting your search terms'}
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card
                key={note._id}
                title={note.title}
                extra={
                  <div className="flex space-x-3">
                    <EditOutlined
                      onClick={() => onEdit(note)}
                      style={{ color: '#1890ff', cursor: 'pointer' }}
                    />
                    <DeleteOutlined
                      onClick={() => handleDeleteNote(note._id)}
                      style={{ color: '#f5222d', cursor: 'pointer' }}
                    />
                  </div>
                }
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 rounded-lg"
                style={{ width: '100%' }}
              >
                <h4 className="text-lg p-2 mb-3 bg-amber-100 rounded-full inline-block">
                  {new Date(note.date).toLocaleDateString()}
                </h4>
                <p className="text-gray-700">{note.desc}</p>
                <div className="mt-3">
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-white rounded-full"
                        style={{
                          backgroundColor: tag.color,
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
