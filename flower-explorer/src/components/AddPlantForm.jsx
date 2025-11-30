// Formulário para adicionar plantas pessoais à coleção
// Converte imagem para base64 para armazenamento no localStorage
import { useState } from 'react';

export default function AddPlantForm({ onAddPlant }) {
  const [name, setName] = useState('');
  const [scientific, setScientific] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Converte imagem selecionada para base64 usando FileReader
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) {
      alert("Please enter the plant's common name.");
      return;
    }

    const newPlant = {
      name,
      scientific: scientific || null,
      location: location || null,
      notes: notes || null,
      image: imagePreview || null, // Base64 string
      imageFile: imageFile,
    };

    onAddPlant(newPlant);

    // Limpa o formulário após submissão
    setName('');
    setScientific('');
    setLocation('');
    setNotes('');
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="swiss-form">
      <h2 className="form-title">Add Your Personal Plant</h2>
      
      <div className="form-grid">
        <div className="form-group span-2">
          <label htmlFor="name">Plant Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Rose Bush"
            required
          />
        </div>

        <div className="form-group span-2">
          <label htmlFor="scientific">Scientific Name (Optional)</label>
          <input
            id="scientific"
            type="text"
            value={scientific}
            onChange={(e) => setScientific(e.target.value)}
            placeholder="e.g. Rosa rubiginosa"
          />
        </div>

        <div className="form-group span-2">
          <label htmlFor="location">Location (Optional)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Garden, Balcony, Indoor"
          />
        </div>

        <div className="form-group span-4">
          <label htmlFor="image-upload">Upload Photo</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  document.getElementById('image-upload').value = '';
                }}
                className="remove-preview"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="form-group span-4">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your plant..."
            rows="3"
          />
        </div>
      </div>

      <button type="submit" className="swiss-submit-btn">
        Add to My Collection
      </button>
    </form>
  );
}
