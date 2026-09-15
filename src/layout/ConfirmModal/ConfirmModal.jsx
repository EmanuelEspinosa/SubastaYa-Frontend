import React from "react";
import "./ConfirmModal.css";

export const ConfirmModal = ({ 
    onConfirm, 
    onCancel, 
    message, 
    prompt, 
    title = "Confirmar Acción",
    isSubmitting = false 
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                
                {message ? (
                    <div className="modal-success-msg">
                        <p>{message}</p>
                    </div>
                ) : (
                    <>
                        <p className="modal-prompt-text">{prompt}</p>
                        <p className="modal-warning-text">
                            Se debitará el compromiso de tu Billetera Virtual de forma segura.
                        </p>
                        
                        <div className="modal-buttons">
                            <button 
                                onClick={onCancel} 
                                className="cancel-btn"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={onConfirm} 
                                className="confirm-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Procesando..." : "Confirmar Oferta"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};