import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import '../../styles/support/SupportWidget.css';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      setScreenshot(file);
    }
  };

  const handleRemoveFile = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feature) {
      toast.error('Por favor, selecione qual funcionalidade apresentou problema.');
      return;
    }

    if (!description.trim()) {
      toast.error('Por favor, descreva o que aconteceu.');
      return;
    }

    setIsSubmitting(true);

    const metadata = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toLocaleString('pt-BR'),
      feature,
      description,
      screenshotName: screenshot ? screenshot.name : null,
    };

    console.log('Chamado de suporte enviado:', metadata);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Chamado de suporte enviado com sucesso!');
      
      // Reset form & close modal
      setFeature('');
      setDescription('');
      setScreenshot(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsOpen(false);
    }, 600);
  };

  return (
    <div className="support-widget-container">
      {isOpen && (
        <div className="support-card" role="dialog" aria-labelledby="support-title">
          {/* Header */}
          <div className="support-card-header">
            <h3 id="support-title" className="support-card-title">
              Suporte Vagas Nordestinas
            </h3>
            <button
              type="button"
              className="support-close-btn"
              onClick={handleToggle}
              aria-label="Fechar suporte"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Subheader */}
          <h4 className="support-card-greeting">Olá! Como podemos ajudar?</h4>

          {/* Form */}
          <form onSubmit={handleSubmit} className="support-form">
            <div className="support-field-group">
              <label htmlFor="support-feature-select" className="support-label">
                Qual funcionalidade apresentou problema?
              </label>
              <div className="support-select-wrapper">
                <select
                  id="support-feature-select"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className="support-select"
                >
                  <option value="" disabled hidden>
                    Selecione uma opção
                  </option>
                  <option value="" disabled selected={feature === ''}>
                    Selecione uma opção
                  </option>
                  <option value="Vagas">Vagas</option>
                  <option value="Login e conta">Login e conta</option>
                  <option value="Comparação de currículo">Comparação de currículo</option>
                  <option value="AI Interview">AI Interview</option>
                  <option value="Scraper / dados">Scraper / dados</option>
                  <option value="Outro">Outro</option>
                </select>
                <div className="support-select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="support-field-group">
              <label htmlFor="support-description-textarea" className="support-label">
                Descreva o que aconteceu
              </label>
              <textarea
                id="support-description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte os detalhes do problema..."
                className="support-textarea"
                rows={3}
              />
            </div>

            {/* Screenshot attachment */}
            <div className="support-attachment-section">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                id="support-file-input"
              />
              
              {!screenshot ? (
                <button
                  type="button"
                  className="support-attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span>Anexar captura de tela</span>
                </button>
              ) : (
                <div className="support-attached-file">
                  <span className="support-file-name" title={screenshot.name}>
                    📎 {screenshot.name}
                  </span>
                  <button
                    type="button"
                    className="support-remove-file-btn"
                    onClick={handleRemoveFile}
                    title="Remover anexo"
                  >
                    ×
                  </button>
                </div>
              )}

              <p className="support-metadata-note">
                URL, navegador e horário serão anexados automaticamente.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="support-submit-btn"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar chamado'}
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher button */}
      <button
        type="button"
        className={`support-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="Abrir suporte"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      </button>
    </div>
  );
}

