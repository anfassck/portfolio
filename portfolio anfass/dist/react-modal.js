const { useState, useEffect } = React;

function ImageModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Open modal when profile picture is clicked
        const profileBtn = document.querySelector('.profile-container');
        const handleOpen = () => {
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
        };
        
        if (profileBtn) {
            profileBtn.addEventListener('click', handleOpen);
        }

        // Cleanup
        return () => {
            if (profileBtn) {
                profileBtn.removeEventListener('click', handleOpen);
            }
        };
    }, []);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto'; // restore regular scrolling
    };

    const handleOutsideClick = (e) => {
        // Only close if clicking the dark overlay, not the image itself
        if (e.target.id === 'reactModalOverlay') {
            handleClose();
        }
    };

    // If modal is not open, render nothing
    if (!isOpen) return null;

    return (
        <div 
            id="reactModalOverlay"
            className="modal show" 
            style={{ display: 'flex' }}
            onClick={handleOutsideClick}
        >
            <div className="sub-modal">
                <span className="close-modal" onClick={handleClose}>&times;</span>
                <img 
                    className="modal-content" 
                    src="/portfolio.png" 
                    alt="Muhammed Anfas CK CEO" 
                />
                <div className="modal-caption" style={{ fontFamily: 'var(--font-heading)' }}>
                    Muhammed Anfas CK - Software Engineer
                </div>
            </div>
        </div>
    );
}

// Render component inside the root document node
const domNode = document.getElementById('react-modal-root');
if (domNode) {
    const root = ReactDOM.createRoot(domNode);
    root.render(<ImageModal />);
}
