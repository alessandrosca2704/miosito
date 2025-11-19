import { useEffect, useRef, useState } from 'react';
import '../Css/ChatAssistant.css';

const SYSTEM_PROMPT = `Sei un assistente digitale cordiale e professionale per L'ingegnere informatico Alessandro Scarimbolo (Cui aree di servizio sono : Realizzazione di sitiweb, integrazione IA all'interno dei workflow, soluzioni IoT. I nostri clienti sono le PMI che voglio approcciarsi al mondo dell'internet). Rispondi in italiano con messaggi sintetici (massimo 3 frasi) e proponi eventuali passi successivi utili.
Se non conosci la risposta, invita l'utente a contattarmi tramite il form principale.`;

const INTRO_MESSAGE =
  "Ciao! Sono il tuo assistente digitale. Chiedimi pure informazioni su servizi, progetti o come contattarci.";

const BubbleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M6 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6.1L9 19.7V15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);



export default function ChatAssistant({ isSuppressed = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: INTRO_MESSAGE }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isSuppressed && isOpen) {
      setIsOpen(false);
    }
  }, [isSuppressed, isOpen]);

  const submitMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/netlify/functions/chatAssistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...nextMessages]
        })
      });

      if (!response.ok) {
        throw new Error('La funzione ha risposto con un errore.');
      }

      const data = await response.json();
      const reply = data?.reply?.trim();

      if (!reply) {
        throw new Error('Risposta vuota dal modello.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('[ChatAssistant] errore invio messaggio', error);
      setErrorMessage("Impossibile contattare l'assistente ora. Riprova piu tardi.");
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Mi dispiace, sto riscontrando un problema tecnico. Prova di nuovo tra qualche minuto.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const classNames = [
    'chat-assistant',
    isOpen ? 'chat-assistant--open' : '',
    isSuppressed ? 'chat-assistant--suppressed' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <button
        type="button"
        className="chat-assistant__toggle"
        aria-expanded={isOpen}
        aria-controls="chat-assistant-panel"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="chat-assistant__icon" aria-hidden="true">
          {isOpen ? <CloseIcon /> : <BubbleIcon />}
        </span>
        <span className="chat-assistant__toggle-label">{isOpen ? 'Chiudi' : 'Serve aiuto?'}</span>
      </button>

      <section
        id="chat-assistant-panel"
        className="chat-assistant__panel"
        aria-live="polite"
        aria-label="Chat con l'assistente digitale"
      >
        <header className="chat-assistant__header">
          <div>
            <p className="chat-assistant__eyebrow">Assistente digitale</p>
            <strong>Hai bisogno di supporto?</strong>
          </div>
          <button type="button" className="chat-assistant__close" onClick={() => setIsOpen(false)}>
            Chiudi
          </button>
        </header>

        <div className="chat-assistant__messages" ref={listRef}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content.length}`}
              className={`chat-assistant__message chat-assistant__message--${message.role}`}
            >
              <p>{message.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="chat-assistant__message chat-assistant__message--assistant">
              <span className="chat-assistant__loader" aria-label="L'assistente sta scrivendo">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>

        {errorMessage && <p className="chat-assistant__error">{errorMessage}</p>}
        <p className="chat-assistant__powered" aria-label="Assistente alimentato da OpenAI">

          <span>Powered by OpenAI</span>
        </p>

        <form className="chat-assistant__form" onSubmit={handleSubmit}>
          <textarea
            rows="2"
            placeholder="Scrivi un messaggio..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading}>
            Invia
          </button>
        </form>
      </section>
    </div>
  );
}
