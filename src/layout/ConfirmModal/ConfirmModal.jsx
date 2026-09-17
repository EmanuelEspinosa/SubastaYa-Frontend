import React from "react";
import "./ConfirmModal.css";

export const ConfirmModal = ({ 
    onConfirm, 
    onCancel, 
    message, 
    errorMessage,
    prompt, 
    title = "Confirmar Acción",
    confirmText = "Confirmar", 
    warningText = null, 
    isSubmitting = false 
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                
                {/* Caso 1: Mensaje de Éxito (Sin botones) */}
                {message && (
                    <div className="modal-success-msg">
                        <p>{message}</p>
                    </div>
                )}

                {/* Caso 2: Mensaje de Error de la API (Sin botones) */}
                {errorMessage && (
                    <div className="modal-error-msg">
                        <p>{errorMessage}</p>
                    </div>
                )}

                {/* Caso 3: Formulario de Confirmación (Con botones) */}
                {!message && !errorMessage && (
                    <>
                        <p className="modal-prompt-text">{prompt}</p>
                        
                        {warningText && (
                            <p className="modal-warning-text">
                                {warningText}
                            </p>
                        )}
                        
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
                                {isSubmitting ? "Procesando..." : confirmText}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};