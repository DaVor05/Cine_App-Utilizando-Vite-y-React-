import { useState } from 'react'
import './App.css'

// Importación de imágenes locales desde la carpeta assets
import imgInsideOut2 from './assets/Inside Out 2.jpg'
import imgFrozen from './assets/Frozen.jpg'
import imgToyStory from './assets/Toy Story.jpg'
import imgLionKing from './assets/The Lion King.jpg'
import imgFindingNemo from './assets/Finding Nemo.jpg'
import imgMoana from './assets/Moana.jpg'
import imgCoco from './assets/Coco.jpg'
import imgZootopia from './assets/Zootopia.jpg'

function App() {
  // 3. Variables del sistema (Requerido por el PDF)
  const cinemaName = "Galaxy Cinema";
  const ticketPrice = 8;
  const serviceFee = 0.10;
  const groupDiscount = 0.15;

  // Catálogo de películas
  const catalogMovies = [
    { id: 1, title: "Inside Out 2", img: imgInsideOut2 },
    { id: 2, title: "Frozen", img: imgFrozen },
    { id: 3, title: "Toy Story", img: imgToyStory },
    { id: 4, title: "The Lion King", img: imgLionKing },
    { id: 5, title: "Finding Nemo", img: imgFindingNemo },
    { id: 6, title: "Moana", img: imgMoana },
    { id: 7, title: "Coco", img: imgCoco },
    { id: 8, title: "Zootopia", img: imgZootopia }
  ];

  // 6. Estados dinámicos de la aplicación
  const [selectedMovie, setSelectedMovie] = useState("Inside Out 2");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [reservationDate, setReservationDate] = useState("2026-05-22");
  const [showtime, setShowtime] = useState("");
  const [roomType, setRoomType] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 7. Cálculos de costos basados en las variables del sistema
  const subtotal = ticketPrice * ticketQuantity;
  const serviceCharge = subtotal * serviceFee;
  const discount = ticketQuantity >= 5 ? subtotal * groupDiscount : 0;
  const totalFinal = subtotal + serviceCharge - discount;

  // 10. Botón Verde (Confirmar): Realiza la validación estricta con el texto exacto del PDF
  const handleReservation = () => {
    if (!customerName.trim() || !customerEmail.trim() || ticketQuantity <= 0 || !roomType || !showtime || !paymentMethod) {
      // TEXTO EXIGIDO TEXTUALMENTE EN LA PÁGINA 4 PUNTO 10 DEL PDF:
      setMessage("Please complete all fields before making the reservation.");
      setIsConfirmed(false);
      setShowSummary(false); 
      return;
    }
    setMessage("Reservación completada con éxito. Ahora puede presionar 'Mostrar Resumen'.");
    setIsConfirmed(true); 
  };

  // Botón Azul (Mostrar Resumen): Controla la apertura del carrito una vez validado
  const handleShowSummary = () => {
    if (!isConfirmed) {
      setMessage("Por favor, presione primero el botón 'Confirmar' para procesar y validar su orden.");
      return;
    }
    setMessage(""); 
    setShowSummary(true); 
  };

  // 8. Botón Cancelar (Reiniciar estados al valor inicial)
  const handleReset = () => {
    setCustomerName("");
    setCustomerEmail("");
    setReservationDate("2026-05-22");
    setShowtime("");
    setRoomType("");
    setTicketQuantity(0);
    setPaymentMethod("");
    setMessage("");
    setIsConfirmed(false);
    setShowSummary(false);
  };

  return (
    <>
      <div className="container">
        <h1 className="main-title">Sistema de Boletos de Cine</h1>

        {/* SECCIÓN 1: Catálogo de Películas */}
        <div className="section movies-catalog-section">
          <h2 className="section-subtitle">Películas</h2>
          <div className="movies-slider">
            {catalogMovies.map((movie) => (
              <div 
                key={movie.id} 
                className={`movie-card ${selectedMovie === movie.title ? 'active-movie' : ''}`}
                onClick={() => {
                  setSelectedMovie(movie.title);
                  setIsConfirmed(false);
                  setShowSummary(false);
                  setMessage("");
                }}
              >
                <img 
                  src={movie.img} 
                  alt={movie.title} 
                  className="movie-poster-img" 
                />
                <p className="movie-card-title">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zona de Trabajo en Dos Columnas */}
        <div className="workspace-grid">
          
          {/* SECCIÓN 4 EN EL PDF: Resumen de Compra (Carrito de Compra) */}
          <div className="section cart-card">
            <h2 className="card-title-blue">Carrito de Compra</h2>
            
            {!showSummary ? (
              <div className="cart-empty-state" style={{ textAlign: 'center', padding: '40px 10px' }}>
                <p className="info-text" style={{ color: '#777', fontStyle: 'italic' }}>
                  Complete sus datos, confirme y presione "Mostrar Resumen" para visualizar su orden.
                </p>
                {/* 9. RENDERIZADO CONDICIONAL DE MENSAJE OBLIGATORIO CUANDO ES 0 (Página 3) */}
                {ticketQuantity === 0 && (
                  <p className="status-alert error-text" style={{ marginTop: '15px', fontWeight: 'bold' }}>
                    Please select at least one ticket
                  </p>
                )}
              </div>
            ) : (
              <div className="cart-billing-info">
                <p><span>Cine</span> <strong>{cinemaName}</strong></p>
                <p><span>Película</span> <strong>{selectedMovie}</strong></p>
                <p><span>Precio Boleto</span> <strong>${ticketPrice.toFixed(2)}</strong></p>
                <p><span>Cargo Servicio</span> <strong>{serviceFee * 100}%</strong></p>
                <hr className="divider" />
                <p><span>Subtotal</span> <strong>${subtotal.toFixed(2)}</strong></p>
                <p><span>Cargo Extra</span> <strong>${serviceCharge.toFixed(2)}</strong></p>
                <p><span>Descuento</span> <strong>${discount.toFixed(2)}</strong></p>
                <hr className="divider" />
                <h3 className="total-display"><span>Total</span> <strong>${totalFinal.toFixed(2)}</strong></h3>
                
                {/* 9. RENDERIZADO CONDICIONAL DE MENSAJES DE ESTADO DENTRO DEL RESUMEN (Página 3) */}
                <div className="conditional-status-message" style={{ marginTop: '15px', textAlign: 'center' }}>
                  {ticketQuantity >= 5 ? (
                    <p className="status-alert success-text" style={{ color: 'green', fontWeight: 'bold' }}>
                      Group discount applied
                    </p>
                  ) : (
                    <p className="status-alert info-text" style={{ color: '#555' }}>
                      Regular reservation
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 2 & 3 EN EL PDF: Información del Cliente / Reservación */}
          <div className="section customer-card">
            <h2 className="card-title-blue">Información del Cliente</h2>
            <form onSubmit={(e) => e.preventDefault()} className="booking-form">
              
              <input 
                type="text" 
                className="input" 
                placeholder="Ingrese su nombre"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setIsConfirmed(false); setShowSummary(false); }}
              />

              <input 
                type="email" 
                className="input" 
                placeholder="Ingrese su correo electrónico"
                value={customerEmail}
                onChange={(e) => { setCustomerEmail(e.target.value); setIsConfirmed(false); setShowSummary(false); }}
              />

              <input 
                type="date" 
                className="input" 
                value={reservationDate}
                onChange={(e) => { setReservationDate(e.target.value); setIsConfirmed(false); setShowSummary(false); }}
              />

              {/* Bonus Challenge Selector de Horario */}
              <select className="input" value={showtime} onChange={(e) => { setShowtime(e.target.value); setIsConfirmed(false); setShowSummary(false); }}>
                <option value="">Seleccione un horario</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>

              <select className="input" value={roomType} onChange={(e) => { setRoomType(e.target.value); setIsConfirmed(false); setShowSummary(false); }}>
                <option value="">Seleccione tipo de sala</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="IMAX">IMAX</option>
              </select>

              <input 
                type="number" 
                className="input" 
                placeholder="Cantidad de boletos"
                value={ticketQuantity === 0 ? "" : ticketQuantity}
                onChange={(e) => { setTicketQuantity(parseInt(e.target.value) || 0); setIsConfirmed(false); setShowSummary(false); }}
                min="0"
              />

              <select className="input" value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setIsConfirmed(false); setShowSummary(false); }}>
                <option value="">Seleccione método de pago</option>
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="Efectivo">Efectivo</option>
              </select>

              {/* Fila de Botones de Control */}
              <div className="form-actions-group">
                <button type="button" className="btn-action btn-cancel" onClick={handleReset}>Cancelar</button>
                <button type="button" className="btn-action btn-summary" onClick={handleShowSummary}>Mostrar Resumen</button>
                <button type="button" className="btn-action btn-confirm" onClick={handleReservation}>Confirmar</button>
              </div>
            </form>
          </div>
        </div>

        {/* Único banner de retroalimentación inferior */}
        {message && <div className="alert-banner-box">{message}</div>}

      </div>
    </>
  )
}

export default App