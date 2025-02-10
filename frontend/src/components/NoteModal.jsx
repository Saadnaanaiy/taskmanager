import { useEffect, useState } from 'react';
import { Modal, Input, Button, Tag, message, Typography, Space } from 'antd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const NoteModal = ({ open, closeModal, addNote, currentNote, editNote }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDesc(currentNote.desc);
      setTags(currentNote.tags);
      setDate(currentNote.date);
    }
  }, [currentNote]);

  // Function to generate a random color for tags
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Add a new tag
  const handleTagClick = () => {
    const value = tagInput.trim();
    if (value && !tags.some((tag) => tag.name === value)) {
      setTags([...tags, { name: value, color: getRandomColor() }]);
      setTagInput(''); // Clear input after adding tag
    }
  };

  // Remove a tag
  const handleTagClose = (removedTag) => {
    setTags(tags.filter((tag) => tag.name !== removedTag.name));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || !date) {
      message.error('Please fill in all fields.');
      return;
    }

    if (currentNote) {
      editNote(currentNote._id, title, desc, date, tags);
    } else {
      addNote(title, desc, tags, date);
    }
    closeModal(); // Close modal after submission
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          {currentNote ? 'Edit Note' : 'Create a New Note'}
        </Title>
      }
      open={open}
      onCancel={closeModal}
      onOk={handleSubmit}
      okText={currentNote ? 'Save Changes' : 'Add Note'}
      width={600}
      centered
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {currentNote ? 'Save Changes' : 'Add Note'}
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Title Input */}
        <div>
          <Text strong>Title</Text>
          <Input
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            allowClear
          />
        </div>

        {/* Description Input */}
        <div>
          <Text strong>Description</Text>
          <TextArea
            placeholder="Enter note description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            allowClear
          />
        </div>

        {/* Date Picker */}
        <div>
          <Text strong>Date</Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Tags Input */}
        <div>
          <Text strong>Tags</Text>
          <Space style={{ width: '100%' }}>
            <Input
              placeholder="Add tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={handleTagClick}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleTagClick}
            >
              Add Tag
            </Button>
          </Space>
          <div
            className="mt-2"
            style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            {tags.map((tag, index) => (
              <Tag
                key={index}
                color={tag.color}
                closable
                closeIcon={<CloseCircleOutlined />}
                onClose={() => handleTagClose(tag)}
                style={{ fontSize: 14, padding: '5px 10px' }}
              >
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default NoteModal;
